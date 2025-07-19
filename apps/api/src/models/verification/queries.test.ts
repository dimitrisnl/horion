import {afterEach, describe, expect, it} from "bun:test";

import {createTestVerificationToken} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateToken} from "../token";
import {findVerificationByIdentifier} from "./queries";

describe("Verification Queries", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("findVerificationByIdentifier", async () => {
    it("should return verification when token exists", async () => {
      const verificationToken = await createTestVerificationToken({db});

      const result = await findVerificationByIdentifier({
        db,
        identifier: verificationToken.identifier,
      });

      expect(result).toBeDefined();
      expect(result!.id).toBe(verificationToken.id);
      expect(result!.identifier).toBe(verificationToken.identifier);
      expect(result!.value).toBe(verificationToken.value);
      expect(result!.expiresAt).toBeInstanceOf(Date);
      expect(result!.createdAt).toBeInstanceOf(Date);
      expect(result!.updatedAt).toBeInstanceOf(Date);
    });

    it("should return null when token does not exist", async () => {
      const result = await findVerificationByIdentifier({
        db,
        identifier: generateToken(),
      });

      expect(result).toBeNull();
    });
  });
});
