import {afterEach, describe, expect, it} from "bun:test";

import {createTestSession, createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateToken} from "../token";
import {createSession, deleteSession} from "./mutations";
import {findSessionByToken} from "./queries";

describe("Session Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("createSession", async () => {
    it("should create a new session with valid user ID", async () => {
      const email = "test@example.com";

      const createdUser = await createTestUser({db, overrides: {email}});
      const createdSession = await createSession({db, userId: createdUser.id});

      expect(createdSession.id).toBeDefined();
      expect(createdSession.token).toBeDefined();
      expect(createdSession.userId).toBe(createdUser.id);
      expect(createdSession.expiresAt).toBeInstanceOf(Date);
      expect(createdSession.createdAt).toBeInstanceOf(Date);
      expect(createdSession.updatedAt).toBeInstanceOf(Date);
    });

    it("should create session with unique token", async () => {
      const email = "test@example.com";

      const createdUser = await createTestUser({db, overrides: {email}});

      const session1 = await createSession({db, userId: createdUser.id});
      const session2 = await createSession({db, userId: createdUser.id});

      expect(session1).toBeDefined();
      expect(session2).toBeDefined();

      expect(session1.token).not.toBe(session2.token);
      expect(session1.id).not.toBe(session2.id);
    });

    it("should set correct expiration time", async () => {
      const email = "test@example.com";

      const createdUser = await createTestUser({db, overrides: {email}});
      const beforeCreation = new Date();

      const createdSession = await createSession({
        db,
        userId: createdUser.id,
      });

      expect(createdSession).toBeDefined();
      expect(createdSession.expiresAt.getTime()).toBeGreaterThan(
        beforeCreation.getTime(),
      );

      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      expect(createdSession.expiresAt.getTime()).toBeLessThanOrEqual(
        thirtyDaysFromNow.getTime(),
      );
    });
  });

  describe("deleteSession", async () => {
    it("should delete session by token", async () => {
      const email = "test@example.com";

      const createdUser = await createTestUser({db, overrides: {email}});

      const createdSession = await createTestSession({
        db,
        overrides: {userId: createdUser.id},
      });

      expect(createdSession).toBeDefined();

      const deletedSession = await deleteSession({
        db,
        token: createdSession.token,
        userId: createdUser.id,
      });

      expect(deletedSession).toBeDefined();

      const sessionAfterDelete = await findSessionByToken({
        db,
        token: createdSession.token,
      });
      expect(sessionAfterDelete).toBeNull();
    });
    it("should not delete session if token does not match user ID", async () => {
      const createdUser = await createTestUser({db});
      const createdUser2 = await createTestUser({db});

      const createdSession = await createTestSession({
        db,
        overrides: {userId: createdUser.id},
      });

      const deletedSession = await deleteSession({
        db,
        token: createdSession.token,
        userId: createdUser2.id,
      });

      expect(deletedSession).toBeNull();

      const sessionAfterDelete = await findSessionByToken({
        db,
        token: createdSession.token,
      });

      expect(sessionAfterDelete).toBeDefined();
    });

    it("should return null for deleting non-existent session", async () => {
      const nonExistentToken = generateToken();
      const createdUser = await createTestUser({db});

      const deletedSession = await deleteSession({
        db,
        token: nonExistentToken,
        userId: createdUser.id,
      });

      expect(deletedSession).toBeNull();
    });
  });
});
