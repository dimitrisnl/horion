import {afterEach, describe, expect, it} from "bun:test";

import {createTestVerificationToken} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getVerificationToken} from "./get-verification-token";

describe("getVerificationToken", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return verification token when token exists", async () => {
    const verificationToken = await createTestVerificationToken({db});

    const result = await getVerificationToken({db})({
      token: verificationToken!.identifier,
    });
    expect(result).toBeDefined();
    expect(result!.id).toBe(verificationToken!.id);
    expect(result!.identifier).toBe(verificationToken!.identifier);
    expect(result!.value).toBe(verificationToken!.value);
    expect(result!.expiresAt).toBeInstanceOf(Date);
    expect(result!.createdAt).toBeInstanceOf(Date);
    expect(result!.updatedAt).toBeInstanceOf(Date);
  });

  it("should return null when token does not exist", async () => {
    const nonExistentToken = "non-existent-token";
    const result = await getVerificationToken({db})({token: nonExistentToken});

    expect(result).toBeNull();
  });
});
