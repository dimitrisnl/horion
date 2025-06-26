import {eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";
import {generateId} from "~/lib/id";

export const SessionRepository = {
  find: async ({token}: {token: string}) => {
    const [session = null] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.token, token))
      .limit(1);

    return session;
  },

  findAll: async ({userId}: {userId: string}) => {
    const sessions = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, userId))
      .orderBy(schema.sessions.createdAt);

    return sessions;
  },

  delete: async ({token}: {token: string}) => {
    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
  },

  create: async ({
    token,
    userId,
    userAgent,
    ipAddress,
    expiresAt,
  }: {
    token: string;
    userId: string;
    userAgent: string;
    ipAddress: string;
    expiresAt: Date;
  }) => {
    const now = new Date();
    const sessionId = generateId();

    const [newSession = null] = await db
      .insert(schema.sessions)
      .values({
        id: sessionId,
        userId,
        userAgent,
        ipAddress,
        expiresAt,
        token,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newSession;
  },
};
