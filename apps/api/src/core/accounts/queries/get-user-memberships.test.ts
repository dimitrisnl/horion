import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createOrganization} from "../actions/create-organization";
import {getUserMemberships} from "./get-user-memberships";

describe("getUserMemberships", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return memberships for user", async () => {
    const {user, org} = await setupTestMembership({db});

    const memberships = await getUserMemberships({db})({
      userId: user!.id,
    });

    expect(memberships).toBeDefined();
    expect(memberships!.length).toBe(1);
    expect(memberships![0].role).toBe("owner");
    expect(memberships![0].organizationId).toBe(org!.id);
    expect(memberships![0].organizationName).toBe(org!.name);
  });

  it("should return empty array when user has no memberships", async () => {
    const createdUser = await createTestUser({db});

    const memberships = await getUserMemberships({db})({
      userId: createdUser!.id,
    });

    expect(memberships).toBeDefined();
    expect(memberships!.length).toBe(0);
  });

  it("should return multiple memberships ordered by creation date", async () => {
    const user = await createTestUser({db});

    await createOrganization({db})({
      name: "First Organization",
      userId: user!.id,
    });
    await createOrganization({db})({
      name: "Second Organization",
      userId: user!.id,
    });

    const memberships = await getUserMemberships({db})({
      userId: user!.id,
    });

    expect(memberships).toBeDefined();
    expect(memberships!.length).toBe(2);

    memberships![0].organizationName = "First Organization";
    memberships![1].organizationName = "Second Organization";

    memberships!.forEach((membership) => {
      expect(membership.role).toBe("owner");
      expect(membership.organizationId).toBeDefined();
      expect(membership.organizationName).toBeDefined();
    });
  });
});
