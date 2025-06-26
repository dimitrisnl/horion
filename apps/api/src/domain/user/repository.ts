import {eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";
import {generateId} from "~/lib/id";

export const userRepo = {
  findById: async ({userId}: {userId: string}) => {
    const [user = null] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .execute();

    return user;
  },
  findByEmail: async ({email}: {email: string}) => {
    const [user = null] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
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
  create: async ({email}: {email: string}) => {
    const now = new Date();
    const userId = generateId();

    const [newUser = null] = await db
      .insert(schema.users)
      .values({
        id: userId,
        name: "",
        email,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newUser;
  },
};
