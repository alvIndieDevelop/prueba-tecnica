import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { getDatabase, upsertUser } from "../src/lib/db";
import type { UserRole, UserStatus } from "../src/lib/types";

interface SeedUserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

const baseSeedUsers: SeedUserInput[] = [
  {
    name: "Demo Admin",
    email: "demo@devpanel.local",
    role: "admin",
    status: "active",
  },
  {
    name: "Lucía Torres",
    email: "lucia@devpanel.local",
    role: "member",
    status: "active",
  },
  {
    name: "Mateo Ruiz",
    email: "mateo@devpanel.local",
    role: "member",
    status: "inactive",
  },
];

const firstNames = [
  "Adriana", "Alejandro", "Beatriz", "Bruno", "Camila",
  "Carlos", "Daniela", "Diego", "Elena", "Felipe",
  "Gabriela", "Hugo", "Irene", "Javier", "Laura",
  "Marcos", "Natalia", "Pablo", "Raquel", "Sergio",
];

const lastNames = [
  "Álvarez", "Castillo", "Domínguez", "Fernández", "García",
  "Herrera", "Morales", "Navarro", "Ortega", "Vega",
];

function createGeneratedUsers(): SeedUserInput[] {
  return firstNames.flatMap((firstName, firstIndex) =>
    lastNames.map((lastName, lastIndex) => {
      const index = firstIndex * lastNames.length + lastIndex + 1;

      return {
        name: `${firstName} ${lastName}`,
        email: `user${index.toString().padStart(3, "0")}@devpanel.local`,
        role: index % 9 === 0 ? "admin" : "member",
        status: index % 5 === 0 ? "inactive" : "active",
      } satisfies SeedUserInput;
    }),
  );
}

async function seed(): Promise<void> {
  const database = getDatabase();
  const [demoPasswordHash, generatedPasswordHash] = await Promise.all([
    hash("Devpanel123!", 12),
    hash(randomBytes(32).toString("base64url"), 12),
  ]);
  const users = [
    ...baseSeedUsers.map((user) => ({ ...user, passwordHash: demoPasswordHash })),
    ...createGeneratedUsers().map((user) => ({ ...user, passwordHash: generatedPasswordHash })),
  ];

  const seedTransaction = database.transaction(() => {
    for (const user of users) {
      upsertUser(user);
    }
  });

  seedTransaction();
  console.log(`Seed completed: ${users.length} users available.`);
}

seed().catch(() => {
  console.error("Seed failed.");
  process.exitCode = 1;
});
