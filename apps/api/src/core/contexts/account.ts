import type {DatabaseConnection} from "~/types/database";
import type {getSessionFingerprint} from "~/utils/fingerprint";

import {
  InvalidVerificationTokenError,
  SessionNotFoundError,
  UserNotFoundError,
  VerificationExpiredError,
} from "../errors/error-types";
import {Membership} from "../models/membership";
import {Session} from "../models/session";
import {SessionMetadata} from "../models/session-metadata";
import {User} from "../models/user";
import {isVerificationExpired, Verification} from "../models/verification";

export const AccountContext = {
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
};
