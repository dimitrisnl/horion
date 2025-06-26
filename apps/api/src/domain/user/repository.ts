import {eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";

export const userRepo = {
  findById: async (userId: string) => {
    const [user = null] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .execute();

    return user;
  },
  update: async ({userId, name}: {userId: string; name: string}) => {
    const [updatedUser] = await db
      .update(schema.users)
      .set({name})
      .where(eq(schema.users.id, userId))
      .returning();

    return updatedUser || null;
  },
};
