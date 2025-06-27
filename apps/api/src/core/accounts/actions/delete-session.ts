import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const deleteSession = async ({token}: {token: string}) => {
  await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
};
