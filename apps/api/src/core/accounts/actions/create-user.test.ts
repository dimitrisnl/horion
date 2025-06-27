import {afterEach, describe, expect, it} from "bun:test";

import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createUser} from "./create-user";

describe("createUser", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should create a new user with valid email", async () => {
    const email = "test@example.com";

    const createdUser = await createUser({db})({email});

    expect(createdUser).toBeDefined();
    expect(createdUser!.email).toBe(email);
    expect(createdUser!.id).toBeDefined();
    expect(createdUser!.name).toBe("");
    expect(createdUser!.emailVerified).toBe(true);
    expect(createdUser!.createdAt).toBeInstanceOf(Date);
    expect(createdUser!.updatedAt).toBeInstanceOf(Date);
  });

  it("should create user with unique ID", async () => {
    const email1 = "user1@example.com";
    const email2 = "user2@example.com";

    const user1 = await createUser({db})({email: email1});
    const user2 = await createUser({db})({email: email2});

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
    expect(user1!.id).not.toBe(user2!.id);
  });
});
