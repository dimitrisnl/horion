import type {DatabaseConnection} from "~/types/database";
import type {getSessionFingerprint} from "~/utils/session-fingerprint";

import {
  InvalidVerificationTokenError,
  InvitationExpiredError,
  InvitationNotFoundError,
  OrganizationNotFoundError,
  SessionNotFoundError,
  UserAlreadyExistsError,
  UserNotFoundError,
  VerificationExpiredError,
} from "../errors";
import {Invitation} from "../models/invitation";
import {Membership} from "../models/membership";
import {Organization} from "../models/organization";
import {Session} from "../models/session";
import {SessionMetadata} from "../models/session-metadata";
import {User} from "../models/user";
import {isVerificationExpired, Verification} from "../models/verification";

export const AccountService = {
  getUserById: async ({
    db,
    actorId,
  }: {
    db: DatabaseConnection;
    actorId: string;
  }) => {
    const user = await User.findById({db, userId: actorId});

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  },

  updateUserName: async ({
    db,
    actorId,
    name,
  }: {
    db: DatabaseConnection;
    actorId: string;
    name: string;
  }) => {
    const user = await User.updateName({db, id: actorId, name});

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  },

  getUserSessions: async ({
    db,
    actorId,
  }: {
    db: DatabaseConnection;
    actorId: string;
  }) => {
    return await Session.findManyByUserId({db, userId: actorId});
  },

  deleteUserSession: async ({
    db,
    token,
    actorId,
  }: {
    db: DatabaseConnection;
    token: string;
    actorId: string;
  }) => {
    const result = await Session.delete({
      db,
      token,
      userId: actorId,
    });

    if (!result) {
      throw new SessionNotFoundError();
    }

    return result;
  },

  getUserMemberships: async ({
    db,
    actorId,
  }: {
    db: DatabaseConnection;
    actorId: string;
  }) => {
    const memberships = await Membership.findManyByUserId({
      db,
      userId: actorId,
    });

    return memberships;
  },

  getUserMembership: async ({
    db,
    actorId,
    organizationId,
  }: {
    db: DatabaseConnection;
    actorId: string;
    organizationId: string;
  }) => {
    const membership = await Membership.find({
      db,
      userId: actorId,
      organizationId,
    });

    return membership;
  },

  getUserInvitations: async ({
    db,
    actorId,
  }: {
    db: DatabaseConnection;
    actorId: string;
  }) => {
    const user = await User.findById({db, userId: actorId});

    if (!user) {
      throw new UserNotFoundError();
    }

    const invitations = await Invitation.findManyByEmail({
      db,
      email: user.email,
    });

    return invitations;
  },

  validateTokenAndCreateUser: async ({
    db,
    token,
    fingerprintMetadata,
  }: {
    db: DatabaseConnection;
    token: string;
    fingerprintMetadata: Awaited<ReturnType<typeof getSessionFingerprint>>;
  }) => {
    let isRegistration = false;

    const verification = await Verification.findByIdentifier({
      db,
      identifier: token,
    });

    if (!verification) {
      throw new InvalidVerificationTokenError();
    }

    if (isVerificationExpired(verification)) {
      throw new VerificationExpiredError();
    }

    let user = await User.findByEmail({
      db,
      email: verification.value,
    });

    if (!user) {
      isRegistration = true;
      const newUser = await User.create({
        db,
        email: verification.value,
        name: "",
        emailVerified: true,
      });
      user = newUser;
    }

    const session = await Session.create({
      db,
      userId: user.id,
    });

    try {
      await SessionMetadata.create({
        db,
        sessionId: session.id,
        ...fingerprintMetadata,
      });
    } catch {
      // Ignore errors for session metadata creation
      // This is not critical for the session creation
    }

    return {session, isRegistration, user};
  },

  acceptInvitationAsGuest: async ({
    db,
    invitationToken,
  }: {
    db: DatabaseConnection;
    invitationToken: string;
  }) => {
    const invitation = await Invitation.findByToken({
      db,
      token: invitationToken,
    });

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status !== "pending") {
      throw new InvitationNotFoundError();
    }

    if (invitation.expiresAt < new Date()) {
      throw new InvitationExpiredError();
    }

    const email = invitation.email;

    const userExists = await User.findByEmail({db, email});

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const organization = await Organization.findById({
      db,
      organizationId: invitation.organizationId,
    });

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const {user, session, membership} = await db.transaction(async (tx) => {
      const user = await User.create({
        db: tx,
        email,
        name: "",
        emailVerified: true,
      });

      const session = await Session.create({
        db: tx,
        userId: user.id,
      });

      const membership = await Membership.create({
        db: tx,
        userId: user.id,
        organizationId: organization.id,
        role: invitation.role,
      });

      await Invitation.delete({
        db: tx,
        id: invitation.id,
        organizationId: organization.id,
      });

      return {user, session, membership};
    });

    return {user, session, membership};
  },

  acceptInvitationAsUser: async ({
    db,
    actorId,
    invitationId,
  }: {
    db: DatabaseConnection;
    actorId: string;
    invitationId: string;
  }) => {
    const invitation = await Invitation.findById({db, invitationId});

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status !== "pending") {
      throw new InvitationNotFoundError();
    }

    if (invitation.expiresAt < new Date()) {
      throw new InvitationExpiredError();
    }

    const user = await User.findById({db, userId: actorId});

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.email !== invitation.email) {
      throw new InvitationNotFoundError();
    }

    const organization = await Organization.findById({
      db,
      organizationId: invitation.organizationId,
    });

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const {membership} = await db.transaction(async (tx) => {
      const membership = await Membership.create({
        db: tx,
        userId: user.id,
        organizationId: organization.id,
        role: invitation.role,
      });

      await Invitation.delete({
        db: tx,
        id: invitation.id,
        organizationId: organization.id,
      });

      return {membership};
    });

    return {membership};
  },
};
