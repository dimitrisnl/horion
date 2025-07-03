import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser, createTestVerificationToken} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {verifyMagicLink} from "./verify-magic-link";

const mockFingerprint = {
  userAgent: "test-agent",
  browser: "TestBrowser",
  os: "TestOS",
  model: "TestModel",
  engine: "TestEngine",
  device: "TestDevice",
};

describe("verifyMagicLink", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should verify a valid token for an existing user and create a session", async () => {
    const user = await createTestUser({db});
    const token = await createTestVerificationToken({
      db,
      overrides: {value: user.email, expiresAt: new Date(Date.now() + 10000)},
    });

    const result = await verifyMagicLink({db})({
      token: token.identifier,
      fingerprintMetadata: mockFingerprint,
    });

    expect(result.type).toBe("success");
    expect(result.session).toBeDefined();
    expect(result.session?.userId).toBe(user.id);
  });

  it("should verify a valid token for a new user, create user and session", async () => {
    const email = "newuser@example.com";
    const token = await createTestVerificationToken({
      db,
      overrides: {value: email, expiresAt: new Date(Date.now() + 10000)},
    });

    const result = await verifyMagicLink({db})({
      token: token.identifier,
      fingerprintMetadata: mockFingerprint,
    });

    expect(result.type).toBe("success");
    expect(result.session).toBeDefined();
    expect(result.session?.userId).toBeDefined();
  });

  it("should return error for invalid token", async () => {
    const result = await verifyMagicLink({db})({
      token: "invalid-token",
      fingerprintMetadata: mockFingerprint,
    });
    expect(result.type).toBe("error");
    expect(result.error).toBe("invalid_token");
  });

  it("should return error for expired token", async () => {
    const token = await createTestVerificationToken({
      db,
      overrides: {expiresAt: new Date(Date.now() - 10000)},
    });
    const result = await verifyMagicLink({db})({
      token: token.identifier,
      fingerprintMetadata: mockFingerprint,
    });
    expect(result.type).toBe("error");
    expect(result.error).toBe("expired_token");
  });
});
