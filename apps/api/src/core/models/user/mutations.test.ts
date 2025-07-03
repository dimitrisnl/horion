import {afterEach, describe, expect, it} from "bun:test";

import {UserAlreadyExistsError} from "~/core/errors/error-types";
import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {createUser, updateUserName} from "./mutations";

describe("User Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("createUser", async () => {
    it("should create a new user with valid email", async () => {
      const email = "test@example.com";

      const createdUser = await createUser({
        db,
        email,
        emailVerified: true,
        name: "",
      });

      expect(createdUser).toBeDefined();
      expect(createdUser!.email).toBe(email);
      expect(createdUser!.id).toBeDefined();
      expect(createdUser!.name).toBe("");
      expect(createdUser!.emailVerified).toBe(true);
      expect(createdUser!.createdAt).toBeInstanceOf(Date);
      expect(createdUser!.updatedAt).toBeInstanceOf(Date);
    });

    it("should create user with unique ID", async () => {
      const email1 = "user1@example.com";
      const email2 = "user2@example.com";

      const user1 = await createUser({
        db,
        email: email1,
        emailVerified: true,
        name: "",
      });
      const user2 = await createUser({
        db,
        email: email2,
        emailVerified: true,
        name: "",
      });

      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      expect(user1!.id).not.toBe(user2!.id);
    });

    it("should throw on duplicate email", async () => {
      const email = "duplicate@example.com";

      await createUser({
        db,
        email,
        emailVerified: true,
        name: "",
      });
      await expect(
        createUser({
          db,
          email,
          emailVerified: true,
          name: "",
        }),
      ).rejects.toThrow(UserAlreadyExistsError);
    });

    it("should throw error when name is too long", async () => {
      const newName = "a".repeat(256);

      expect(
        createUser({
          db,
          email: "test@example.com",
          emailVerified: true,
          name: newName,
        }),
      ).rejects.toThrow();
    });
  });

  describe("updateUser", async () => {
    it("should update user name successfully", async () => {
      const email = "test@example.com";
      const newName = "Updated User Name";

      const createdUser = await createTestUser({db, overrides: {email}});

      const result = await updateUserName({
        db,
        id: createdUser!.id,
        name: newName,
      });

      expect(result).toBeDefined();
      expect(result!.id).toBe(createdUser!.id);
      expect(result!.name).toBe(newName);
      expect(result!.email).toBe(email);
    });

    it("should return null for non-existent user", async () => {
      const nonExistentUserId = generateId();
      const newName = "Updated Name";

      const result = await updateUserName({
        db,
        id: nonExistentUserId,
        name: newName,
      });

      expect(result).toBeNull();
    });
  });
});
