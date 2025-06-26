import {and, eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";

export const membershipRepo = {
  findAll: async ({userId}: {userId: string}) => {
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
  },

  async find({
    organizationId,
    userId,
  }: {
    organizationId: string;
    userId: string;
  }) {
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
  },
};
