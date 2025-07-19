import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";
import type {z} from "zod/v4";

import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {
  createOrganizationInputSchema,
  organizationSchema,
  updateOrganizationInputSchema,
} from "./schema";

export const createOrganization = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof createOrganizationInputSchema>) => {
  const now = new Date();

  const values = organizationSchema.parse({
    ...attrs,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  });

  const [newOrganization] = await db
    .insert(schema.organizations)
    .values(values)
    .returning();

  return newOrganization;
};

export const updateOrganizationName = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof updateOrganizationInputSchema>) => {
  updateOrganizationInputSchema.parse(attrs);

  const [updatedOrganization = null] = await db
    .update(schema.organizations)
    .set({
      name: attrs.name,
      updatedAt: new Date(),
    })
    .where(eq(schema.organizations.id, attrs.id))
    .returning();

  return updatedOrganization;
};
