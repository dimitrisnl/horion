import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface GetSessionsProps {
  userId: string;
}

export const getSessions = ({db}: {db: Database}) => {
  return async (props: GetSessionsProps) => {
    const {userId} = props;

    console.log("userId", userId);

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
};
