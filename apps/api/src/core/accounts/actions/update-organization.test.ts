import {afterEach, describe, expect, it} from "bun:test";

import {createTestUser, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {updateOrganization} from "./update-organization";

describe("updateOrganization", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should update organization name successfully", async () => {
    const newName = "Updated Organization";

    const {user, org, membership} = await setupTestMembership({db});

    expect(user).toBeDefined();
    expect(org).toBeDefined();
    expect(membership).toBeDefined();

    const updatedOrg = await updateOrganization({db})({
      organizationId: org!.id,
      userId: user!.id,
      name: newName,
    });

    expect(updatedOrg).toBeDefined();
    expect(updatedOrg!.id).toBe(org!.id);
    expect(updatedOrg!.name).toBe(newName);
  });

  it("should throw error when user is not member of organization", async () => {
    const email = "test@example.com";
    const newName = "Updated Organization";

    const {org} = await setupTestMembership({db});
    const rogueUser = await createTestUser({db, overrides: {email}});

    expect(
      updateOrganization({db})({
        organizationId: org!.id,
        userId: rogueUser!.id,
        name: newName,
      }),
    ).rejects.toThrow("Organization not found");
  });

  it("should throw error for non-existent organization", async () => {
    const email = "test@example.com";
    const nonExistentOrgId = "non-existent-org-id";
    const newName = "Updated Organization";

    const createdUser = await createTestUser({db, overrides: {email}});

    expect(
      updateOrganization({db})({
        organizationId: nonExistentOrgId,
        userId: createdUser!.id,
        name: newName,
      }),
    ).rejects.toThrow("Organization not found");
  });
});
