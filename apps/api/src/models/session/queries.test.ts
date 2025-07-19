import {afterEach, describe, expect, it} from "bun:test";

import {createTestSession, createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {findSessionByToken, findSessionsByUserId} from "./queries";

describe("Session Queries", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("findSessionByToken", async () => {
    it("should return session when token exists", async () => {
      const createdUser = await createTestUser({db});
      const createdSession = await createTestSession({
        db,
        overrides: {userId: createdUser.id},
      });

      const result = await findSessionByToken({
        db,
        token: createdSession!.token,
      });

      expect(result).toBeDefined();
      expect(result!.id).toBe(createdSession!.id);
      expect(result!.token).toBe(createdSession!.token);
      expect(result!.userId).toBe(createdUser!.id);
      expect(result!.expiresAt).toBeInstanceOf(Date);
      expect(result!.createdAt).toBeInstanceOf(Date);
      expect(result!.updatedAt).toBeInstanceOf(Date);
    });

    it("should return null when token does not exist", async () => {
      const nonExistentToken = "non-existent-token";
      const result = await findSessionByToken({db, token: nonExistentToken});

      expect(result).toBeNull();
    });
  });

  describe("findSessionsByUserId", async () => {
    it("should return sessions when user exists", async () => {
      const createdUser = await createTestUser({db});
      const createdSession = await createTestSession({
        db,
        overrides: {userId: createdUser!.id},
      });

      const result = await findSessionsByUserId({
        db,
        userId: createdUser.id,
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe(createdSession!.id);
    });

    it("should return multiple sessions ordered by creation date", async () => {
      const createdUser = await createTestUser({db});

      await createTestSession({
        db,
        overrides: {userId: createdUser.id},
      });
      await createTestSession({
        db,
        overrides: {userId: createdUser.id},
      });

      const result = await findSessionsByUserId({
        db,
        userId: createdUser!.id,
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].createdAt!.getTime()).toBeLessThanOrEqual(
        result[1].createdAt!.getTime(),
      );
    });

    it("should return an empty array when sessions does not exist", async () => {
      const createdUser = await createTestUser({db});

      const result = await findSessionsByUserId({db, userId: createdUser.id});

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it("should return an empty array when user does not exist", async () => {
      const result = await findSessionsByUserId({db, userId: generateId()});

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });
});
