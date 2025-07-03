import {afterEach, describe, expect, it} from "bun:test";

import {
  createTestSession,
  createTestUser,
  createTestVerificationToken,
  setupTestMembership,
} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {
  InvalidVerificationTokenError,
  SessionNotFoundError,
  UserNotFoundError,
  VerificationExpiredError,
} from "../errors/error-types";
import {generateId} from "../models/id";
import {AccountContext} from "./account";

describe("Account Context", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("getUserById", async () => {
    it("should return user by ID", async () => {
      const user = await createTestUser({db});

      const foundUser = await AccountContext.getUserById({
        db,
        actorId: user.id,
      });

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
    });

    it("should throw error if user not found", async () => {
      expect(
        AccountContext.getUserById({
          db,
          actorId: generateId(),
        }),
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe("updateUserName", async () => {
    it("should update user name", async () => {
      const user = await createTestUser({db});

      const updatedUser = await AccountContext.updateUserName({
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
        AccountContext.updateUserName({
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
      const sessions = await AccountContext.getUserSessions({
        db,
        actorId: user.id,
      });
      expect(sessions).toBeDefined();
      expect(sessions.length).toBe(1);
      expect(sessions[0].id).toBe(session.id);
    });

    it("should return empty array if no sessions", async () => {
      const user = await createTestUser({db});
      const sessions = await AccountContext.getUserSessions({
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

      const result = await AccountContext.deleteUserSession({
        db,
        token: session.token,
        actorId: user.id,
      });

      expect(result).toBeDefined();
    });

    it("should throw error if session not found", async () => {
      expect(
        AccountContext.deleteUserSession({
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
      const memberships = await AccountContext.getUserMemberships({
        db,
        actorId: user.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships.length).toBe(1);
    });
    it("should return empty array if no memberships", async () => {
      const user = await createTestUser({db});
      const memberships = await AccountContext.getUserMemberships({
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

      const result = await AccountContext.validateTokenAndCreateUser({
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
        AccountContext.validateTokenAndCreateUser({
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
        AccountContext.validateTokenAndCreateUser({
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

      const result = await AccountContext.validateTokenAndCreateUser({
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

      const result = await AccountContext.validateTokenAndCreateUser({
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
});
