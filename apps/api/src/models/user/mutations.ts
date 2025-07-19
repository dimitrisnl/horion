import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";
import {z} from "zod/v4";

import {UserAlreadyExistsError} from "~/errors";
import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {
  createUserInputSchema,
  updateUserNameInputSchema,
  userSchema,
} from "./schema";

export const createUser = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof createUserInputSchema>) => {
  const now = new Date();

  const values = userSchema.parse({
    ...attrs,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  });

  const [newUser] = await db
    .insert(schema.users)
    .values(values)
    .returning()
    .onConflictDoNothing();

  if (!newUser) {
    throw new UserAlreadyExistsError();
  }

  return newUser;
};

export const updateUserName = async ({
  db,
  id,
  ...attrs
}: {
  db: DatabaseConnection;
  id: string;
} & z.infer<typeof updateUserNameInputSchema>) => {
  updateUserNameInputSchema.parse(attrs);

  const [updatedUser] = await db
    .update(schema.users)
    .set({
      name: attrs.name,
      updatedAt: new Date(),
    })
    .where(eq(schema.users.id, id))
    .returning();

  if (!updatedUser) {
    return null;
  }

  return updatedUser;
};
