import {afterEach, describe, expect, it} from "bun:test";

import {
  createTestSession,
  createTestSessionMetadata,
  createTestUser,
} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getSessions} from "./get-sessions";

describe("getSessions", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return sessions with metadata for user", async () => {
    const createdUser = await createTestUser({db});
    const createdSession = await createTestSession({
      db,
      overrides: {userId: createdUser!.id},
    });
    const createdSessionMetadata = await createTestSessionMetadata({
      db,
      overrides: {sessionId: createdSession!.id},
    });

    const result = await getSessions({db})({
      userId: createdUser!.id,
    });

    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].id).toBe(createdSession!.id);
    expect(result![0].browser).toBe(createdSessionMetadata!.browser);
    expect(result![0].os).toBe(createdSessionMetadata!.os);
    expect(result![0].createdAt).toBeInstanceOf(Date);
  });

  it("should return empty array when user has no sessions", async () => {
    const createdUser = await createTestUser({db});

    const result = await getSessions({db})({userId: createdUser!.id});

    expect(result).toBeDefined();
    expect(result!.length).toBe(0);
  });

  it("should return multiple sessions ordered by creation date", async () => {
    const createdUser = await createTestUser({db});

    await createTestSession({
      db,
      overrides: {userId: createdUser!.id},
    });
    await createTestSession({
      db,
      overrides: {userId: createdUser!.id},
    });

    const result = await getSessions({db})({
      userId: createdUser!.id,
    });

    expect(result).toBeDefined();
    expect(result!.length).toBe(2);
    expect(result![0].createdAt!.getTime()).toBeLessThanOrEqual(
      result![1].createdAt!.getTime(),
    );
  });
});
