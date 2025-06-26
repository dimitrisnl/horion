import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

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
      .select({
        id: schema.sessions.id,
        browser: schema.sessionMetadata.browser,
        os: schema.sessionMetadata.os,
        createdAt: schema.sessions.createdAt,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, userId))
      .orderBy(schema.sessions.createdAt)
      .innerJoin(
        schema.sessionMetadata,
        eq(schema.sessions.id, schema.sessionMetadata.sessionId),
      );

    return sessions;
  },

  delete: async ({token}: {token: string}) => {
    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
  },

  create: async ({
    token,
    userId,
    expiresAt,
  }: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) => {
    const now = new Date();
    const sessionId = generateId();

    const [newSession = null] = await db
      .insert(schema.sessions)
      .values({
        id: sessionId,
        userId,
        expiresAt,
        token,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newSession;
  },

  createMetadata: async ({
    sessionId,
    userAgent,
    browser,
    os,
    device,
    engine,
    model,
    ipAddress,
  }: {
    sessionId: string;
    userAgent: string;
    browser: string;
    os: string;
    device: string;
    engine: string;
    model: string;
    ipAddress?: string;
  }) => {
    const now = new Date();
    const metadataId = generateId();

    await db.insert(schema.sessionMetadata).values({
      id: metadataId,
      sessionId,
      userAgent,
      browser,
      os,
      device,
      engine,
      model,
      ipAddress: ipAddress || null,
      createdAt: now,
      updatedAt: now,
    });
  },
};
