import { compare } from "bcryptjs";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import {
  createSessionRecord,
  deleteExpiredSessions,
  deleteSessionByTokenHash,
  findUserByEmail,
  findUserBySessionTokenHash,
} from "@/lib/db";
import type { PublicUser } from "@/lib/types";

export const SESSION_COOKIE_NAME = "devpanel_session";
export const SESSION_DURATION_SECONDS = parseSessionDuration(process.env.SESSION_DURATION_SECONDS);

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export async function authenticateCredentials(
  email: string,
  password: string,
): Promise<PublicUser | null> {
  const user = findUserByEmail(email);

  if (!user || user.status !== "active") {
    return null;
  }

  const passwordMatches = await compare(password, user.password_hash);
  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export function createSession(userId: number): CreatedSession {
  deleteExpiredSessions();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  createSessionRecord({
    id: randomUUID(),
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt: expiresAt.toISOString(),
  });

  return { token, expiresAt };
}

export function getSessionUser(token: string | undefined): PublicUser | null {
  if (!token) {
    return null;
  }

  return findUserBySessionTokenHash(hashSessionToken(token));
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  return getSessionUser(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export function invalidateSession(token: string | undefined): void {
  if (token) {
    deleteSessionByTokenHash(hashSessionToken(token));
  }
}

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function parseSessionDuration(value: string | undefined): number {
  const duration = Number(value ?? 60 * 60 * 24 * 7);

  if (!Number.isSafeInteger(duration) || duration <= 0) {
    throw new Error("SESSION_DURATION_SECONDS must be a positive integer.");
  }

  return duration;
}
