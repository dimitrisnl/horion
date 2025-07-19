import * as schema from "@horionos/db/schema";

import {z} from "zod/v4";

import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {type createMembershipInputSchema, membershipSchema} from "./schema";

export const createMembership = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof createMembershipInputSchema>) => {
  const now = new Date();

  const values = membershipSchema.parse({
    id: generateId(),
    ...attrs,
    createdAt: now,
    updatedAt: now,
  });

  const [membership] = await db
    .insert(schema.memberships)
    .values(values)
    .returning();

  return membership;
};
