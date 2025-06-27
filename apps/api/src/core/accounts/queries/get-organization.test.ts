import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createOrganization} from "../actions/create-organization";
import {getOrganization} from "./get-organization";

describe("getOrganization", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return organization when user is member", async () => {
    const createdUser = await createTestUser({db});
    const createdOrg = await createOrganization({
      db,
    })({name: "Test Organization", userId: createdUser!.id});

    const result = await getOrganization({db})({
      organizationId: createdOrg!.id,
      userId: createdUser!.id,
    });
    expect(result).toBeDefined();
    expect(result!.id).toBe(createdOrg!.id);
    expect(result!.name).toBe("Test Organization");
    expect(result!.createdAt).toBeInstanceOf(Date);
  });

  it("should throw error when user is not member of organization", async () => {
    const email = "test@example.com";

    const {org} = await setupTestMembership({db});
    const rogueUser = await createTestUser({db, overrides: {email}});

    expect(
      getOrganization({db})({
        organizationId: org!.id,
        userId: rogueUser!.id,
      }),
    ).rejects.toThrow("Organization not found");
  });

  it("should throw error for non-existent organization", async () => {
    const email = "test@example.com";
    const nonExistentOrgId = "non-existent-org-id";

    const createdUser = await createTestUser({db, overrides: {email}});

    expect(
      getOrganization({db})({
        organizationId: nonExistentOrgId,
        userId: createdUser!.id,
      }),
    ).rejects.toThrow("Organization not found");
  });
});
