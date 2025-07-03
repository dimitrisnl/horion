import * as schema from "@horionos/db/schema";

import {addDays} from "date-fns";
import {and, eq} from "drizzle-orm";
import type {z} from "zod/v4";

import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {generateToken} from "../token";
import {
  createSessionInputSchema,
  deleteSessionInputSchema,
  SESSION_EXPIRATION_IN_DAYS,
  sessionSchema,
} from "./schema";

export const createSession = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof createSessionInputSchema>) => {
  const now = new Date();

  const values = sessionSchema.parse({
    ...attrs,
    id: generateId(),
    token: generateToken(),
    expiresAt: addDays(now, SESSION_EXPIRATION_IN_DAYS),
    createdAt: now,
    updatedAt: now,
  });

  const [newSession] = await db
    .insert(schema.sessions)
    .values(values)
    .returning();

  return newSession;
};

export const deleteSession = async ({
  db,
  token,
  userId,
}: {
  db: DatabaseConnection;
} & z.infer<typeof deleteSessionInputSchema>) => {
  const [deletedSession] = await db
    .delete(schema.sessions)
    .where(
      and(eq(schema.sessions.token, token), eq(schema.sessions.userId, userId)),
    )
    .returning();

  return deletedSession || null;
};
