import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

import type {DatabaseConnection} from "~/types/database";

export const findUserByEmail = async ({
  db,
  email,
}: {
  db: DatabaseConnection;
  email: string;
}) => {
  const [user = null] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  return user;
};

export const findUserById = async ({
  db,
  userId,
}: {
  db: DatabaseConnection;
  userId: string;
}) => {
  const [user = null] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return user;
};
