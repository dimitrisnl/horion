import {and, eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";

export const membershipRepo = {
  getUserMemberships: async ({userId}: {userId: string}) => {
    const memberships = await db
      .select({
        memberId: schema.members.id,
        role: schema.members.role,
        organizationId: schema.organizations.id,
        organizationName: schema.organizations.name,
      })
      .from(schema.members)
      .where(eq(schema.members.userId, userId))
      .innerJoin(
        schema.organizations,
        eq(schema.members.organizationId, schema.organizations.id),
      )
      .orderBy(schema.members.createdAt);

    return memberships;
  },

  async getUserMembership({
    organizationId,
    userId,
  }: {
    organizationId: string;
    userId: string;
  }) {
    const [membership] = await db
      .select()
      .from(schema.members)
      .where(
        and(
          eq(schema.members.organizationId, organizationId),
          eq(schema.members.userId, userId),
        ),
      )
      .limit(1);

    return membership || null;
  },
};
