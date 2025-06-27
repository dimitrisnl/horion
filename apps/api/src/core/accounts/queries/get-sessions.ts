import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const getSessions = async ({userId}: {userId: string}) => {
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
};
