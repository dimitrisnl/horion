import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {and, eq} from "drizzle-orm";

import {generateId} from "~/lib/id";

export const organizationRepo = {
  async find({
    organizationId,
    userId,
  }: {
    organizationId: string;
    userId: string;
  }) {
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
  },

  async create({name, userId}: {name: string; userId: string}) {
    const now = new Date();
    const orgId = generateId();
    const memberId = generateId();

    const [org = null] = await db.transaction(async (tx) => {
      const [newOrg] = await tx
        .insert(schema.organizations)
        .values({id: orgId, name, createdAt: now})
        .returning();

      await tx.insert(schema.memberships).values({
        id: memberId,
        userId: userId,
        organizationId: orgId,
        role: "owner",
        createdAt: now,
      });

      return [newOrg];
    });

    return org;
  },

  async update({organizationId, name}: {organizationId: string; name: string}) {
    const [org = null] = await db
      .update(schema.organizations)
      .set({name})
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    return org;
  },
};
