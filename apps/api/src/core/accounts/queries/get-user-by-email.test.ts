import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getUserByEmail} from "./get-user-by-email";

describe("getUserByEmail", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return user when email exists", async () => {
    const createdUser = await createTestUser({db});

    const result = await getUserByEmail({db})({
      email: createdUser!.email,
    });

    expect(result).toBeDefined();
    expect(result?.email).toBe(createdUser!.email);
    expect(result?.id).toBe(createdUser!.id);
  });

  it("should return null when email does not exist", async () => {
    const email = "nonexistent@example.com";
    const result = await getUserByEmail({db})({email});

    expect(result).toBeNull();
  });
});
