import {eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";

export const SessionRepository = {
  getAll: async ({userId}: {userId: string}) => {
    const sessions = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, userId))
      .orderBy(schema.sessions.createdAt);

    return sessions;
  },
};
