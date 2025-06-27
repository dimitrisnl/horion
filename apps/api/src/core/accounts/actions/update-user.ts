import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const updateUser = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  const [updatedUser] = await db
    .update(schema.users)
    .set({name})
    .where(eq(schema.users.id, userId))
    .returning();

  return updatedUser || null;
};
