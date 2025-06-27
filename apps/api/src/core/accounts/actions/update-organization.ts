import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {ORPCError} from "@orpc/client";
import {eq} from "drizzle-orm";

import {getUserMembership} from "~/core/accounts/queries/get-user-membership";

export const updateOrganization = async ({
  organizationId,
  userId,
  name,
}: {
  organizationId: string;
  userId: string;
  name: string;
}) => {
  const membership = await getUserMembership({
    organizationId,
    userId,
  });

  if (!membership) {
    throw new ORPCError("Organization not found");
  }

  const [org = null] = await db
    .update(schema.organizations)
    .set({name})
    .where(eq(schema.organizations.id, organizationId))
    .returning();

  return org;
};
