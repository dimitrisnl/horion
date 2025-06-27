import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {generateId} from "~/utils/id/generate-id";

export const createUser = async ({email}: {email: string}) => {
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
};
