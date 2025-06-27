import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {SESSION_DURATION_IN_SECONDS} from "~/constants";
import {generateId} from "~/utils/id/generate-id";
import {generateToken} from "~/utils/id/generate-token";

interface CreateSessionProps {
  userId: string;
}

export const createSession = ({db}: {db: Database}) => {
  return async (props: CreateSessionProps) => {
    const {userId} = props;

    const token = generateToken();
    const sessionId = generateId();

    const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000); // 30 days

    const [newSession = null] = await db
      .insert(schema.sessions)
      .values({
        id: sessionId,
        userId,
        expiresAt,
        token,
      })
      .returning();

    return newSession;
  };
};
