import * as schema from "@horionos/db/schema";

import {and, eq} from "drizzle-orm";

import type {DatabaseConnection} from "~/types/database";

export const findInvitationById = async ({
  db,
  invitationId,
}: {
  db: DatabaseConnection;
  invitationId: string;
}) => {
  const [invitation = null] = await db
    .select()
    .from(schema.invitations)
    .where(eq(schema.invitations.id, invitationId));

  return invitation;
};

export const findInvitationByToken = async ({
  db,
  token,
}: {
  db: DatabaseConnection;
  token: string;
}) => {
  const [invitation = null] = await db
    .select()
    .from(schema.invitations)
    .where(eq(schema.invitations.token, token));

  return invitation;
};

export const findInvitationsByOrganizationId = async ({
  db,
  organizationId,
}: {
  db: DatabaseConnection;
  organizationId: string;
}) => {
  const invitations = await db
    .select({
      id: schema.invitations.id,
      email: schema.invitations.email,
      role: schema.invitations.role,
      status: schema.invitations.status,
      createdAt: schema.invitations.createdAt,
      updatedAt: schema.invitations.updatedAt,
      expiresAt: schema.invitations.expiresAt,
      inviterId: schema.invitations.inviterId,
      inviterName: schema.users.name,
      inviterEmail: schema.users.email,
    })
    .from(schema.invitations)
    .where(eq(schema.invitations.organizationId, organizationId))
    .leftJoin(schema.users, eq(schema.invitations.inviterId, schema.users.id));

  return invitations;
};

export const findInvitationByEmailAndOrganizationId = async ({
  db,
  email,
  organizationId,
}: {
  db: DatabaseConnection;
  email: string;
  organizationId: string;
}) => {
  const [invitation = null] = await db
    .select()
    .from(schema.invitations)
    .where(
      and(
        eq(schema.invitations.email, email),
        eq(schema.invitations.organizationId, organizationId),
      ),
    );

  return invitation;
};

export const findInvitationsByEmail = async ({
  db,
  email,
}: {
  db: DatabaseConnection;
  email: string;
}) => {
  const invitations = await db
    .select({
      id: schema.invitations.id,
      email: schema.invitations.email,
      role: schema.invitations.role,
      status: schema.invitations.status,
      createdAt: schema.invitations.createdAt,
      updatedAt: schema.invitations.updatedAt,
      expiresAt: schema.invitations.expiresAt,
      inviterId: schema.invitations.inviterId,
      inviterName: schema.users.name,
      inviterEmail: schema.users.email,
      organizationName: schema.organizations.name,
    })
    .from(schema.invitations)
    .where(eq(schema.invitations.email, email))
    .leftJoin(schema.users, eq(schema.invitations.inviterId, schema.users.id))
    .leftJoin(
      schema.organizations,
      eq(schema.invitations.organizationId, schema.organizations.id),
    );

  return invitations;
};
