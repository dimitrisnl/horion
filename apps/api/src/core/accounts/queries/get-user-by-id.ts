import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const getUserById = async ({userId}: {userId: string}) => {
  const [user = null] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return user;
};
