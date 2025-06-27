import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {updateUser} from "./update-user";

describe("updateUser", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should update user name successfully", async () => {
    const email = "test@example.com";
    const newName = "Updated User Name";

    const createdUser = await createTestUser({db, overrides: {email}});

    const result = await updateUser({db})({
      userId: createdUser!.id,
      name: newName,
    });

    expect(result).toBeDefined();
    expect(result!.id).toBe(createdUser!.id);
    expect(result!.name).toBe(newName);
    expect(result!.email).toBe(email);
  });

  it("should return null for non-existent user", async () => {
    const nonExistentUserId = "non-existent-user-id";
    const newName = "Updated Name";

    const result = await updateUser({db})({
      userId: nonExistentUserId,
      name: newName,
    });

    expect(result).toBeNull();
  });
});
