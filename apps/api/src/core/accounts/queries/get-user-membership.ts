import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {and, eq} from "drizzle-orm";

export const getUserMembership = async ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  const [membership = null] = await db
    .select()
    .from(schema.memberships)
    .where(
      and(
        eq(schema.memberships.organizationId, organizationId),
        eq(schema.memberships.userId, userId),
      ),
    )
    .limit(1);

  return membership;
};
