import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {findUserByEmail, findUserById} from "./queries";

describe("User Queries", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("findUserById", async () => {
    it("should return user when ID exists", async () => {
      const createdUser = await createTestUser({db});

      const result = await findUserById({db, userId: createdUser!.id});

      expect(result).toBeDefined();
      expect(result!.id).toBe(createdUser!.id);
      expect(result!.email).toBe(createdUser!.email);
      expect(result!.name).toBe(createdUser!.name);
      expect(result!.emailVerified).toBe(createdUser!.emailVerified);
    });

    it("should return null when ID does not exist", async () => {
      const nonExistentId = "non-existent-id";
      const result = await findUserById({db, userId: nonExistentId});

      expect(result).toBeNull();
    });
  });

  describe("findUserByEmail", async () => {
    it("should return user when email exists", async () => {
      const createdUser = await createTestUser({db});

      const result = await findUserByEmail({db, email: createdUser!.email});

      expect(result).toBeDefined();
      expect(result?.email).toBe(createdUser!.email);
      expect(result?.id).toBe(createdUser!.id);
    });

    it("should return null when email does not exist", async () => {
      const email = "nonexistent@example.com";
      const result = await findUserByEmail({db, email});

      expect(result).toBeNull();
    });
  });
});
