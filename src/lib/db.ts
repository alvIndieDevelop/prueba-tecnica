import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { DashboardMetrics, PublicUser, UserRole, UserStatus } from "@/lib/types";

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
}

interface PublicUserRow {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface CountRow {
  count: number;
}

interface SessionUserRow extends PublicUserRow {
  expires_at: string;
}

interface DatabaseGlobal {
  devpanelDatabase?: Database.Database;
}

const databaseGlobal = globalThis as typeof globalThis & DatabaseGlobal;

function createDatabase(): Database.Database {
  const configuredPath = process.env.DATABASE_PATH ?? "./data/devpanel.sqlite";
  const databasePath = resolve(/* turbopackIgnore: true */ process.cwd(), configuredPath);

  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
  `);

  return database;
}

export function getDatabase(): Database.Database {
  if (!databaseGlobal.devpanelDatabase) {
    databaseGlobal.devpanelDatabase = createDatabase();
  }

  return databaseGlobal.devpanelDatabase;
}

export function findUserByEmail(email: string): UserRow | undefined {
  return getDatabase()
    .prepare("SELECT id, name, email, password_hash, role, status FROM users WHERE email = ?")
    .get(email) as UserRow | undefined;
}

export function upsertUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
}): void {
  getDatabase()
    .prepare(`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES (@name, @email, @passwordHash, @role, @status)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        password_hash = excluded.password_hash,
        role = excluded.role,
        status = excluded.status
    `)
    .run(input);
}

export function createSessionRecord(input: {
  id: string;
  userId: number;
  tokenHash: string;
  expiresAt: string;
}): void {
  getDatabase()
    .prepare(`
      INSERT INTO sessions (id, user_id, token_hash, expires_at)
      VALUES (@id, @userId, @tokenHash, @expiresAt)
    `)
    .run(input);
}

export function findUserBySessionTokenHash(tokenHash: string): PublicUser | null {
  const row = getDatabase()
    .prepare(`
      SELECT users.id, users.name, users.email, users.role, users.status, sessions.expires_at
      FROM sessions
      INNER JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
    `)
    .get(tokenHash) as SessionUserRow | undefined;

  if (!row) {
    return null;
  }

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    deleteSessionByTokenHash(tokenHash);
    return null;
  }

  return toPublicUser(row);
}

export function deleteSessionByTokenHash(tokenHash: string): void {
  getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}

export function deleteExpiredSessions(): void {
  getDatabase().prepare("DELETE FROM sessions WHERE expires_at <= ?").run(new Date().toISOString());
}

export function getDashboardMetrics(): DashboardMetrics {
  const total = getDatabase().prepare("SELECT COUNT(*) AS count FROM users").get() as CountRow;
  const active = getDatabase()
    .prepare("SELECT COUNT(*) AS count FROM users WHERE status = 'active'")
    .get() as CountRow;

  return { totalUsers: total.count, activeUsers: active.count };
}

export function searchUsers(filters: {
  query: string;
  role?: UserRole;
  status?: UserStatus;
  page: number;
  limit: number;
}): { users: PublicUser[]; total: number; page: number; limit: number; totalPages: number } {
  const conditions: string[] = [];
  const parameters: string[] = [];

  if (filters.query) {
    const pattern = `%${filters.query}%`;
    conditions.push("(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\')");
    parameters.push(pattern, pattern);
  }

  if (filters.role) {
    conditions.push("role = ?");
    parameters.push(filters.role);
  }

  if (filters.status) {
    conditions.push("status = ?");
    parameters.push(filters.status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const totalRow = getDatabase()
    .prepare(`SELECT COUNT(*) AS count FROM users ${whereClause}`)
    .get(...parameters) as CountRow;
  const totalPages = Math.max(1, Math.ceil(totalRow.count / filters.limit));
  const page = Math.min(filters.page, totalPages);
  const offset = (page - 1) * filters.limit;
  const rows = getDatabase()
    .prepare(`
      SELECT id, name, email, role, status
      FROM users
      ${whereClause}
      ORDER BY name COLLATE NOCASE ASC, id ASC
      LIMIT ? OFFSET ?
    `)
    .all(...parameters, filters.limit, offset) as PublicUserRow[];

  return {
    users: rows.map(toPublicUser),
    total: totalRow.count,
    page,
    limit: filters.limit,
    totalPages,
  };
}

function toPublicUser(row: PublicUserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}
