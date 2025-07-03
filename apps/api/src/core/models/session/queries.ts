import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

import type {DatabaseConnection} from "~/types/database";

export const findSessionByToken = async ({
  db,
  token,
}: {
  db: DatabaseConnection;
  token: string;
}) => {
  const [session = null] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.token, token))
    .limit(1);

  return session;
};

export const findSessionsByUserId = async ({
  db,
  userId,
}: {
  db: DatabaseConnection;
  userId: string;
}) => {
  const sessions = await db
    .select({
      id: schema.sessions.id,
      browser: schema.sessionMetadata.browser,
      os: schema.sessionMetadata.os,
      createdAt: schema.sessions.createdAt,
    })
    .from(schema.sessions)
    .where(eq(schema.sessions.userId, userId))
    .orderBy(schema.sessions.createdAt)
    .leftJoin(
      schema.sessionMetadata,
      eq(schema.sessions.id, schema.sessionMetadata.sessionId),
    );

  return sessions;
};
