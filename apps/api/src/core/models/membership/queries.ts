import * as schema from "@horionos/db/schema";

import {and, eq} from "drizzle-orm";

import type {DatabaseConnection} from "~/types/database";

export const findMembership = async ({
  db,
  organizationId,
  userId,
}: {
  db: DatabaseConnection;
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
    );

  return membership;
};

export const findMembershipsByUserId = async ({
  db,
  userId,
}: {
  db: DatabaseConnection;
  userId: string;
}) => {
  const memberships = await db
    .select({
      memberId: schema.memberships.id,
      role: schema.memberships.role,
      organizationId: schema.organizations.id,
      organizationName: schema.organizations.name,
      createdAt: schema.memberships.createdAt,
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

export const findMembershipsByOrganizationId = async ({
  db,
  organizationId,
}: {
  db: DatabaseConnection;
  organizationId: string;
}) => {
  const memberships = await db
    .select({
      memberName: schema.users.name,
      memberEmail: schema.users.email,
      memberId: schema.memberships.userId,
      role: schema.memberships.role,
      createdAt: schema.memberships.createdAt,
    })
    .from(schema.memberships)
    .where(eq(schema.memberships.organizationId, organizationId))
    .innerJoin(schema.users, eq(schema.memberships.userId, schema.users.id))
    .orderBy(schema.memberships.createdAt);

  return memberships;
};
