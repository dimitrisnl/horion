import {afterEach, describe, expect, it} from "bun:test";

import {createTestSession, createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getSession} from "../queries/get-session";
import {deleteSession} from "./delete-session";

describe("deleteSession", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should delete session by token", async () => {
    const email = "test@example.com";

    const createdUser = await createTestUser({db, overrides: {email}});

    const createdSession = await createTestSession({
      db,
      overrides: {userId: createdUser!.id},
    });

    expect(createdSession).toBeDefined();

    await deleteSession({db})({token: createdSession!.token});

    const sessionAfterDelete = await getSession({db})({
      token: createdSession!.token,
    });
    expect(sessionAfterDelete).toBeNull();
  });

  it("should handle deleting non-existent session", async () => {
    const nonExistentToken = "non-existent-token";

    await deleteSession({db})({token: nonExistentToken});

    const session = await getSession({db})({
      token: nonExistentToken,
    });
    expect(session).toBeNull();
  });
});
