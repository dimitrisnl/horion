import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createSession} from "./create-session";

describe("createSession", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should create a new session with valid user ID", async () => {
    const email = "test@example.com";

    const createdUser = await createTestUser({db, overrides: {email}});
    const createdSession = await createSession({db})({userId: createdUser!.id});

    expect(createdSession!.id).toBeDefined();
    expect(createdSession!.token).toBeDefined();
    expect(createdSession!.userId).toBe(createdUser!.id);
    expect(createdSession!.expiresAt).toBeInstanceOf(Date);
    expect(createdSession!.createdAt).toBeInstanceOf(Date);
    expect(createdSession!.updatedAt).toBeInstanceOf(Date);
  });

  it("should create session with unique token", async () => {
    const email = "test@example.com";

    const createdUser = await createTestUser({db, overrides: {email}});

    const session1 = await createSession({db})({
      userId: createdUser!.id,
    });

    const session2 = await createSession({db})({
      userId: createdUser!.id,
    });

    expect(session1).toBeDefined();
    expect(session2).toBeDefined();

    expect(session1!.token).not.toBe(session2!.token);
    expect(session1!.id).not.toBe(session2!.id);
  });

  it("should set correct expiration time", async () => {
    const email = "test@example.com";

    const createdUser = await createTestUser({db, overrides: {email}});
    const beforeCreation = new Date();

    const createdSession = await createSession({db})({
      userId: createdUser!.id,
    });

    expect(createdSession).toBeDefined();
    expect(createdSession!.expiresAt.getTime()).toBeGreaterThan(
      beforeCreation.getTime(),
    );

    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    expect(createdSession!.expiresAt!.getTime()).toBeLessThanOrEqual(
      thirtyDaysFromNow.getTime(),
    );
  });
});
