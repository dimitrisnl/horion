import * as schema from "@horionos/db/schema";

import {and, eq} from "drizzle-orm";

import type {DatabaseConnection} from "~/types/database";

export const findOrganization = async ({
  db,
  organizationId,
}: {
  db: DatabaseConnection;
  organizationId: string;
}) => {
  const [org = null] = await db
    .select()
    .from(schema.organizations)

    .where(and(eq(schema.organizations.id, organizationId)))
    .limit(1);

  return org;
};
