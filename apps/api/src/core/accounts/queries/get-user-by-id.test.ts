import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getUserById} from "./get-user-by-id";

describe("getUserById", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return user when ID exists", async () => {
    const createdUser = await createTestUser({db});

    const result = await getUserById({db})({
      userId: createdUser!.id,
    });

    expect(result).toBeDefined();
    expect(result!.id).toBe(createdUser!.id);
    expect(result!.email).toBe(createdUser!.email);
    expect(result!.name).toBe(createdUser!.name);
    expect(result!.emailVerified).toBe(createdUser!.emailVerified);
  });

  it("should return null when ID does not exist", async () => {
    const nonExistentId = "non-existent-id";
    const result = await getUserById({db})({userId: nonExistentId});

    expect(result).toBeNull();
  });
});
