import type {DatabaseConnection} from "~/types/database";

import {
  InsufficientPermissionsError,
  InvitationAlreadyExistsError,
  InvitationExpiredError,
  InvitationNotFoundError,
  MembershipAlreadyExistsError,
  OrganizationNotFoundError,
  UnexpectedError,
} from "../errors";
import {Invitation} from "../models/invitation";
import {Membership} from "../models/membership";
import {Organization} from "../models/organization";
import {User} from "../models/user";

export const OrganizationService = {
  getOrganization: async ({
    db,
    organizationId,
    actorId,
  }: {
    db: DatabaseConnection;
    organizationId: string;
    actorId: string;
  }) => {
    const membership = await Membership.find({
      db,
      organizationId,
      userId: actorId,
    });

    if (!membership) {
      throw new OrganizationNotFoundError();
    }

    const organization = await Organization.findById({
      db,
      organizationId,
    });

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    return organization;
  },

  createOrganization: async ({
    db,
    name,
    actorId,
  }: {
    db: DatabaseConnection;
    name: string;
    actorId: string;
  }) => {
    const [organization = null, membership = null] = await db.transaction(
      async (tx) => {
        const organization = await Organization.create({
          db: tx,
          name,
        });

        const membership = await Membership.create({
          db: tx,
          organizationId: organization.id,
          userId: actorId,
          role: "owner",
        });

        return [organization, membership];
      },
    );

    if (!organization || !membership) {
      throw new UnexpectedError("Failed to create organization");
    }

    return {organization, membership};
  },

  updateOrganization: async ({
    db,
    organizationId,
    name,
    actorId,
  }: {
    db: DatabaseConnection;
    organizationId: string;
    name: string;
    actorId: string;
  }) => {
    const membership = await Membership.find({
      db,
      organizationId,
      userId: actorId,
    });

    if (!membership) {
      throw new OrganizationNotFoundError();
    }

    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new InsufficientPermissionsError(
        "Only admins and owners can update the organization.",
      );
    }

    const organization = await Organization.updateName({
      db,
      id: organizationId,
      name,
    });

    return organization;
  },

  createInvitation: async ({
    db,
    email,
    role,
    organizationId,
    actorId,
  }: {
    db: DatabaseConnection;
    email: string;
    role: "admin" | "member";
    organizationId: string;
    actorId: string;
  }) => {
    const organization = await Organization.findById({
      db,
      organizationId,
    });

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const membership = await Membership.find({
      db,
      organizationId: organization.id,
      userId: actorId,
    });

    if (!membership) {
      throw new OrganizationNotFoundError();
    }

    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new InsufficientPermissionsError(
        "Only admins and owners can create invitations.",
      );
    }

    const invitee = await User.findByEmail({
      db,
      email,
    });

    if (invitee) {
      const inviteeMembership = await Membership.find({
        db,
        organizationId: organization.id,
        userId: invitee.id,
      });

      if (inviteeMembership) {
        if (invitee.id === actorId) {
          throw new MembershipAlreadyExistsError(
            "You cannot invite yourself. Nice try!",
          );
        }

        throw new MembershipAlreadyExistsError(
          "User is already a member of this organization.",
        );
      }
    }

    const existingInvitation = await Invitation.findByEmailAndOrganizationId({
      db,
      email,
      organizationId: organization.id,
    });

    if (existingInvitation) {
      throw new InvitationAlreadyExistsError();
    }

    const invitation = await Invitation.create({
      db,
      email,
      role,
      organizationId: organization.id,
      inviterId: actorId,
    });

    return {
      invitation,
      organization,
      invitee,
    };
  },

  getInvitations: async ({
    db,
    organizationId,
    userId,
  }: {
    db: DatabaseConnection;
    organizationId: string;
    userId: string;
  }) => {
    const membership = await Membership.find({
      db,
      organizationId,
      userId,
    });

    if (!membership) {
      throw new OrganizationNotFoundError();
    }

    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new InsufficientPermissionsError(
        "Only admins and owners can view invitations.",
      );
    }

    const invitations = await Invitation.findManyByOrganizationId({
      db,
      organizationId,
    });

    return invitations;
  },

  deleteInvitation: async ({
    db,
    invitationId,
    actorId,
    organizationId,
  }: {
    db: DatabaseConnection;
    invitationId: string;
    actorId: string;
    organizationId: string;
  }) => {
    const membership = await Membership.find({
      db,
      organizationId,
      userId: actorId,
    });

    if (!membership) {
      throw new OrganizationNotFoundError();
    }

    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new InsufficientPermissionsError(
        "Only admins and owners can delete invitations.",
      );
    }

    const invitation = await Invitation.delete({
      db,
      id: invitationId,
      organizationId,
    });

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    return invitation;
  },

  getInvitationByToken: async ({
    db,
    token,
  }: {
    db: DatabaseConnection;
    token: string;
  }) => {
    const invitation = await Invitation.findByToken({
      db,
      token,
    });

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.expiresAt < new Date()) {
      throw new InvitationExpiredError();
    }

    const organization = await Organization.findById({
      db,
      organizationId: invitation.organizationId,
    });

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    return {organization, invitation};
  },

  getMemberships: async ({
    db,
    organizationId,
    actorId,
  }: {
    db: DatabaseConnection;
    organizationId: string;
    actorId: string;
  }) => {
    const membership = await Membership.find({
      db,
      organizationId,
      userId: actorId,
    });

    if (!membership) {
      throw new OrganizationNotFoundError();
    }

    const memberships = await Membership.findManyByOrganizationId({
      db,
      organizationId,
    });

    return memberships;
  },
};
