import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const getUserByEmail = async ({email}: {email: string}) => {
  const [user = null] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  return user;
};
