import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const getSession = async ({token}: {token: string}) => {
  const [session = null] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.token, token))
    .limit(1);

  return session;
};
