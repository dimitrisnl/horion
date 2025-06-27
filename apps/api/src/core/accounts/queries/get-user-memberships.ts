import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const getUserMemberships = async ({userId}: {userId: string}) => {
  const memberships = await db
    .select({
      memberId: schema.memberships.id,
      role: schema.memberships.role,
      organizationId: schema.organizations.id,
      organizationName: schema.organizations.name,
    })
    .from(schema.memberships)
    .where(eq(schema.memberships.userId, userId))
    .innerJoin(
      schema.organizations,
      eq(schema.memberships.organizationId, schema.organizations.id),
    )
    .orderBy(schema.memberships.createdAt);

  return memberships;
};
