import {afterEach, describe, expect, it} from "bun:test";

import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createVerificationToken} from "./create-verification-token";

describe("createVerificationToken", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should create a verification token with valid email", async () => {
    const email = "test@example.com";

    const result = await createVerificationToken({db})({email});

    expect(result).toBeDefined();
    expect(result!.id).toBeDefined();
    expect(result!.identifier).toBeDefined();
    expect(result!.value).toBe(email);
    expect(result!.expiresAt).toBeInstanceOf(Date);
  });

  it("should create verification token with unique identifier", async () => {
    const email1 = "user1@example.com";
    const email2 = "user2@example.com";

    const token1 = await createVerificationToken({db})({email: email1});
    const token2 = await createVerificationToken({db})({email: email2});

    expect(token1).toBeDefined();
    expect(token2).toBeDefined();

    expect(token1!.identifier).not.toBe(token2!.identifier);
    expect(token1!.id).not.toBe(token2!.id);
  });

  it("should set correct expiration time", async () => {
    const email = "test@example.com";

    const beforeCreation = new Date();

    const createdToken = await createVerificationToken({db})({email});

    expect(createdToken).toBeDefined();
    expect(createdToken!.expiresAt.getTime()).toBeGreaterThan(
      beforeCreation.getTime(),
    );

    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    expect(createdToken!.expiresAt!.getTime()).toBeLessThanOrEqual(
      fiveMinutesFromNow.getTime(),
    );
  });
});
