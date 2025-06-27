import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getUserMembership} from "./get-user-membership";

describe("getUserMembership", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return membership when user is member of organization", async () => {
    const {user, org} = await setupTestMembership({db});

    const membership = await getUserMembership({db})({
      organizationId: org!.id,
      userId: user!.id,
    });

    expect(membership).toBeDefined();
    expect(membership!.userId).toBe(user!.id);
    expect(membership!.organizationId).toBe(org!.id);
    expect(membership!.role).toBe("owner");
    expect(membership!.createdAt).toBeInstanceOf(Date);
  });

  it("should return null when user is not member of organization", async () => {
    const {org} = await setupTestMembership({db});

    const rogueUser = await createTestUser({db});

    const membership = await getUserMembership({db})({
      organizationId: org!.id,
      userId: rogueUser!.id,
    });
    expect(membership).toBeNull();
  });

  it("should return null for non-existent organization", async () => {
    const createdUser = await createTestUser({db});

    const result = await getUserMembership({db})({
      organizationId: "non-existent-org-id",
      userId: createdUser!.id,
    });

    expect(result).toBeNull();
  });
});
