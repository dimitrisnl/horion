import {afterEach, describe, expect, it} from "bun:test";

import {createTestSession, createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getSession} from "./get-session";

describe("getSession", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return session when token exists", async () => {
    const createdUser = await createTestUser({db});
    const createdSession = await createTestSession({
      db,
      overrides: {userId: createdUser!.id},
    });

    const result = await getSession({db})({
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
    const result = await getSession({db})({token: nonExistentToken});

    expect(result).toBeNull();
  });
});
