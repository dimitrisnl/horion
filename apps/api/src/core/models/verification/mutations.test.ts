import {afterEach, describe, expect, it} from "bun:test";

import {createTestVerificationToken} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateToken} from "../token";
import {createVerification, deleteVerificationByIdentifier} from "./mutations";

describe("Verification Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });
  describe("createVerification", async () => {
    it("should create a verification with valid email", async () => {
      const email = "test@example.com";

      const result = await createVerification({db, value: email});

      expect(result).toBeDefined();
      expect(result!.id).toBeDefined();
      expect(result!.identifier).toBeDefined();
      expect(result!.value).toBe(email);
      expect(result!.expiresAt).toBeInstanceOf(Date);
    });

    it("should create verification token with unique identifier", async () => {
      const email1 = "user1@example.com";
      const email2 = "user2@example.com";

      const verification1 = await createVerification({db, value: email1});
      const verification2 = await createVerification({db, value: email2});

      expect(verification1).toBeDefined();
      expect(verification2).toBeDefined();

      expect(verification1!.identifier).not.toBe(verification2!.identifier);
      expect(verification1!.id).not.toBe(verification2!.id);
    });

    it("should set correct expiration time", async () => {
      const email = "test@example.com";

      const beforeCreation = new Date();

      const createdVerification = await createVerification({db, value: email});

      expect(createdVerification).toBeDefined();
      expect(createdVerification!.expiresAt.getTime()).toBeGreaterThan(
        beforeCreation.getTime(),
      );

      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      expect(createdVerification!.expiresAt!.getTime()).toBeLessThanOrEqual(
        fiveMinutesFromNow.getTime(),
      );
    });
  });

  describe("deleteVerificationToken", async () => {
    it("should delete verification token by identifier", async () => {
      const email = "test@example.com";

      const createdVerification = await createTestVerificationToken({
        db,
        overrides: {value: email},
      });

      expect(createdVerification).toBeDefined();

      const deletedVerification = await deleteVerificationByIdentifier({
        db,
        identifier: createdVerification!.identifier,
      });

      expect(deletedVerification).toBeDefined();
      expect(deletedVerification!.identifier).toBe(
        createdVerification!.identifier,
      );
    });

    it("should return null for non-existent verification token", async () => {
      const deletedVerification = await deleteVerificationByIdentifier({
        db,
        identifier: generateToken(),
      });

      expect(deletedVerification).toBeNull();
    });
  });
});
