import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {ORPCError} from "@orpc/client";
import {and, eq} from "drizzle-orm";

import {getUserMembership} from "./get-user-membership";

export const getOrganization = async ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  const membership = await getUserMembership({
    organizationId,
    userId,
  });

  if (!membership) {
    throw new ORPCError("Organization not found");
  }

  const [org = null] = await db
    .select({
      id: schema.organizations.id,
      name: schema.organizations.name,
      logo: schema.organizations.logo,
      createdAt: schema.organizations.createdAt,
    })
    .from(schema.organizations)
    .innerJoin(
      schema.memberships,
      eq(schema.organizations.id, schema.memberships.organizationId),
    )
    .where(
      and(
        eq(schema.organizations.id, organizationId),
        eq(schema.memberships.userId, userId),
      ),
    )
    .limit(1);

  return org;
};
