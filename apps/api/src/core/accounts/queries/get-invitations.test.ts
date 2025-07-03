import {afterEach, describe, expect, it} from "bun:test";

import {createTestInvitation, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getInvitations} from "./get-invitations";

describe("getInvitations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should return invitations for the organization", async () => {
    const {user, org} = await setupTestMembership({db});

    const invitation1 = await createTestInvitation({
      db,
      overrides: {inviterId: user.id, organizationId: org.id},
    });

    const invitation2 = await createTestInvitation({
      db,
      overrides: {inviterId: user.id, organizationId: org.id},
    });

    const invitations = await getInvitations({db})({
      organizationId: org.id,
      userId: user.id,
    });

    expect(invitations).toBeDefined();
    expect(Array.isArray(invitations)).toBe(true);
    expect(invitations.length).toBe(2);
    expect(invitations[0].id).toBe(invitation1.id);
    expect(invitations[1].id).toBe(invitation2.id);
  });

  it("should return an empty array if no invitations exist for the org", async () => {
    const {user, org} = await setupTestMembership({db});

    const invitations = await getInvitations({db})({
      organizationId: org.id,
      userId: user.id,
    });

    expect(invitations).toBeDefined();
    expect(Array.isArray(invitations)).toBe(true);
    expect(invitations.length).toBe(0);
  });
});
