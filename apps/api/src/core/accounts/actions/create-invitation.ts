import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {ORPCError} from "@orpc/client";
import {and, eq} from "drizzle-orm";

import {INVITATION_TOKEN_DURATION_IN_SECONDS} from "~/constants";
import {generateId} from "~/utils/id/generate-id";

import {getUserMembership} from "../queries/get-user-membership";
import {invitationDomainSchema} from "../schemas/invitation";

interface CreateInvitationProps {
  email: string;
  role: "admin" | "member";
  organizationId: string;
  userId: string;
}

export const createInvitation = ({db}: {db: Database}) => {
  return async (props: CreateInvitationProps) => {
    const {email, role, organizationId, userId} = props;

    const [organization] = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.id, organizationId))
      .limit(1);

    if (!organization) {
      throw new ORPCError("Organization not found");
    }

    const membership = await getUserMembership({db})({
      organizationId,
      userId,
    });

    if (!membership) {
      throw new ORPCError("Invitation not found");
    }

    // TODO: Authorize this query in a more robust way
    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new ORPCError("Only admins and owners can create invitations.");
    }

    const [inviteeMembership = null] = await db
      .select({membershipId: schema.memberships.id})
      .from(schema.users)
      .leftJoin(
        schema.memberships,
        and(
          eq(schema.users.id, schema.memberships.userId),
          eq(schema.memberships.organizationId, organizationId),
        ),
      )
      .where(eq(schema.users.email, email))
      .limit(1);

    if (inviteeMembership && inviteeMembership.membershipId) {
      throw new ORPCError("User is already a member of this organization.");
    }

    // Check for existing invitation (by email + org)
    const [existingInvitation] = await db
      .select()
      .from(schema.invitations)
      .where(
        and(
          eq(schema.invitations.email, email),
          eq(schema.invitations.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (existingInvitation) {
      throw new ORPCError("Invitation already exists for this email.");
    }

    const invitationId = generateId();
    const expiresAt = new Date(
      Date.now() + INVITATION_TOKEN_DURATION_IN_SECONDS * 1000,
    );

    const parsedInvitation = invitationDomainSchema.parse({
      id: invitationId,
      email,
      role,
      organizationId,
      inviterId: userId,
      expiresAt,
    });

    const [newInvitation = null] = await db
      .insert(schema.invitations)
      .values(parsedInvitation)
      .returning();

    if (!newInvitation) {
      throw new ORPCError("Failed to create invitation.");
    }

    return {invitation: newInvitation, organization};
  };
};
