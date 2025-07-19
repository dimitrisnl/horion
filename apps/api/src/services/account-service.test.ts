import {afterEach, describe, expect, it} from "bun:test";

import {
  createTestInvitation,
  createTestSession,
  createTestUser,
  createTestVerificationToken,
  setupTestMembership,
} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {
  InvalidVerificationTokenError,
  InvitationNotFoundError,
  SessionNotFoundError,
  UserAlreadyExistsError,
  UserNotFoundError,
  VerificationExpiredError,
} from "../errors";
import {generateId} from "../models/id";
import {AccountService} from "./account-service";

describe("Account Service", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("getUserById", async () => {
    it("should return user by ID", async () => {
      const user = await createTestUser({db});

      const foundUser = await AccountService.getUserById({
        db,
        actorId: user.id,
      });

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
    });

    it("should throw error if user not found", async () => {
      expect(
        AccountService.getUserById({
          db,
          actorId: generateId(),
        }),
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe("updateUserName", async () => {
    it("should update user name", async () => {
      const user = await createTestUser({db});

      const updatedUser = await AccountService.updateUserName({
        db,
        actorId: user.id,
        name: "New Name",
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.name).toBe("New Name");
    });

    it("should throw error if user not found", async () => {
      expect(
        AccountService.updateUserName({
          db,
          actorId: generateId(),
          name: "New Name",
        }),
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe("getUserSessions", async () => {
    it("should return user sessions", async () => {
      const user = await createTestUser({db});
      const session = await createTestSession({
        db,
        overrides: {userId: user.id},
      });
      const sessions = await AccountService.getUserSessions({
        db,
        actorId: user.id,
      });
      expect(sessions).toBeDefined();
      expect(sessions.length).toBe(1);
      expect(sessions[0].id).toBe(session.id);
    });

    it("should return empty array if no sessions", async () => {
      const user = await createTestUser({db});
      const sessions = await AccountService.getUserSessions({
        db,
        actorId: user.id,
      });
      expect(sessions).toBeDefined();
      expect(sessions.length).toBe(0);
    });
  });

  describe("deleteUserSession", async () => {
    it("should delete user session", async () => {
      const user = await createTestUser({db});
      const session = await createTestSession({
        db,
        overrides: {userId: user.id},
      });

      const result = await AccountService.deleteUserSession({
        db,
        token: session.token,
        actorId: user.id,
      });

      expect(result).toBeDefined();
    });

    it("should throw error if session not found", async () => {
      expect(
        AccountService.deleteUserSession({
          db,
          token: generateId(),
          actorId: generateId(),
        }),
      ).rejects.toThrow(SessionNotFoundError);
    });
  });

  describe("getUserMemberships", async () => {
    it("should return user memberships", async () => {
      const {user} = await setupTestMembership({db});
      const memberships = await AccountService.getUserMemberships({
        db,
        actorId: user.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships.length).toBe(1);
    });
    it("should return empty array if no memberships", async () => {
      const user = await createTestUser({db});
      const memberships = await AccountService.getUserMemberships({
        db,
        actorId: user.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships.length).toBe(0);
    });
  });
  describe("validateTokenAndCreateUser", async () => {
    it("should validate token and create user", async () => {
      const token = await createTestVerificationToken({db});

      const result = await AccountService.validateTokenAndCreateUser({
        db,
        token: token.identifier,
        fingerprintMetadata: {
          os: "test-os",
          browser: "test-browser",
          userAgent: "test-agent",
          device: "test-device",
          engine: "test-engine",
          model: "test-model",
        },
      });

      expect(result.user).toBeDefined();
      expect(result!.user!.email).toBe(token.value);
      expect(result.session).toBeDefined();
      expect(result!.session!.userId).toBe(result!.user!.id);
      expect(result.isRegistration).toBe(true);
    });
    it("should throw error for invalid token", async () => {
      expect(
        AccountService.validateTokenAndCreateUser({
          db,
          token: generateId(),
          fingerprintMetadata: {
            os: "test-os",
            browser: "test-browser",
            userAgent: "test-agent",
            device: "test-device",
            engine: "test-engine",
            model: "test-model",
          },
        }),
      ).rejects.toThrow(InvalidVerificationTokenError);
    });
    it("should throw for expired token", async () => {
      const token = await createTestVerificationToken({
        db,
        overrides: {expiresAt: new Date(Date.now() - 1000)},
      });

      expect(
        AccountService.validateTokenAndCreateUser({
          db,
          token: token.identifier,
          fingerprintMetadata: {
            os: "test-os",
            browser: "test-browser",
            userAgent: "test-agent",
            device: "test-device",
            engine: "test-engine",
            model: "test-model",
          },
        }),
      ).rejects.toThrow(VerificationExpiredError);
    });

    it("should proceed without fingerprint metadata", async () => {
      const token = await createTestVerificationToken({db});

      const result = await AccountService.validateTokenAndCreateUser({
        db,
        token: token.identifier,
        fingerprintMetadata: {} as never,
      });

      expect(result.isRegistration).toBe(true);
      expect(result.user).toBeDefined();
    });

    it("should proceed without creating a new user", async () => {
      const user = await createTestUser({db});
      const token = await createTestVerificationToken({
        db,
        overrides: {value: user.email},
      });

      const result = await AccountService.validateTokenAndCreateUser({
        db,
        token: token.identifier,
        fingerprintMetadata: {
          os: "test-os",
          browser: "test-browser",
          userAgent: "test-agent",
          device: "test-device",
          engine: "test-engine",
          model: "test-model",
        },
      });

      expect(result.isRegistration).toBe(false);
      expect(result.user).toBeDefined();
      expect(result.user!.email).toBe(user.email);
      expect(result.user?.id).toBe(user.id);
    });
  });

  describe("acceptInvitationAsGuest", async () => {
    it("should accept invitation as guest", async () => {
      const {org, user: inviter} = await setupTestMembership({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {
          organizationId: org.id,
          inviterId: inviter.id,
          role: "admin",
        },
      });

      const {user, membership} = await AccountService.acceptInvitationAsGuest({
        db,
        invitationToken: invitation.token,
      });

      expect(user).toBeDefined();
      expect(membership).toBeDefined();
      expect(membership.userId).toBe(user.id);
      expect(membership.organizationId).toBe(org.id);
      expect(membership.role).toBe("admin");
    });
    it("should throw error if invitation not found", async () => {
      expect(
        AccountService.acceptInvitationAsGuest({
          db,
          invitationToken: generateId(),
        }),
      ).rejects.toThrow(InvitationNotFoundError);
    });

    it("should throw if invitee already exists", async () => {
      const {org, user: inviter} = await setupTestMembership({db});
      const user = await createTestUser({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {
          organizationId: org.id,
          inviterId: inviter.id,
          email: user.email,
        },
      });

      expect(
        AccountService.acceptInvitationAsGuest({
          db,
          invitationToken: invitation.token,
        }),
      ).rejects.toThrow(UserAlreadyExistsError);
    });
  });

  describe("acceptInvitationAsUser", async () => {
    it("should accept invitation as user", async () => {
      const {org, user: inviter} = await setupTestMembership({db});
      const user = await createTestUser({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {
          organizationId: org.id,
          inviterId: inviter.id,
          email: user.email,
        },
      });

      const {membership} = await AccountService.acceptInvitationAsUser({
        db,
        actorId: user.id,
        invitationId: invitation.id,
      });

      expect(membership).toBeDefined();
      expect(membership.userId).toBe(user.id);
      expect(membership.organizationId).toBe(org.id);
      expect(membership.role).toBe("member");
    });

    it("should throw error if invitation not found", async () => {
      expect(
        AccountService.acceptInvitationAsUser({
          db,
          actorId: generateId(),
          invitationId: generateId(),
        }),
      ).rejects.toThrow(InvitationNotFoundError);
    });

    it("should throw if the user email does not match the invitation email", async () => {
      const {org, user: inviter} = await setupTestMembership({db});
      const user = await createTestUser({db});
      const otherUser = await createTestUser({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {
          organizationId: org.id,
          inviterId: inviter.id,
          email: user.email,
        },
      });

      expect(
        AccountService.acceptInvitationAsUser({
          db,
          actorId: otherUser.id,
          invitationId: invitation.id,
        }),
      ).rejects.toThrow(InvitationNotFoundError);
    });
  });
});
