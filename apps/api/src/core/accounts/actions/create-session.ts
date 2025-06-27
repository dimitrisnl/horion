import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {SESSION_DURATION_IN_SECONDS} from "~/constants";
import {generateId} from "~/utils/id/generate-id";
import {generateToken} from "~/utils/id/generate-token";

export const createSession = async ({userId}: {userId: string}) => {
  const token = generateToken();
  const sessionId = generateId();

  const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000); // 30 days
  const now = new Date();

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
};
