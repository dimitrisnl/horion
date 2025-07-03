import {afterEach, describe, expect, it} from "bun:test";

import {createTestOrganization, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createInvitation} from "./create-invitation";

describe("createInvitation", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should create a new invitation with valid data", async () => {
    const email = "test@example.com";
    const role = "member";
    const {user, org} = await setupTestMembership({db});

    const invitation = await createInvitation({db})({
      email,
      role,
      organizationId: org.id,
      userId: user.id,
    });

    expect(invitation).toBeDefined();
    expect(invitation.email).toBe(email);
    expect(invitation.role).toBe(role);
    expect(invitation.organizationId).toBe(org.id);
    expect(invitation.inviterId).toBe(user.id);
  });

  it("should throw an error if invitation already exists for the email", async () => {
    const email = "test@example.com";
    const role = "member";
    const {user, org} = await setupTestMembership({db});

    const initialInvitation = await createInvitation({db})({
      email,
      role,
      organizationId: org.id,
      userId: user.id,
    });

    expect(initialInvitation).toBeDefined();
    expect(initialInvitation.email).toBe(email);

    try {
      await createInvitation({db})({
        email,
        role,
        organizationId: org.id,
        userId: user.id,
      });
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof Error) {
        expect(error.message).toBe("Invitation already exists for this email.");
      } else {
        throw error;
      }
    }
  });

  it("should throw an error if user is already a member of the organization", async () => {
    const {user, org} = await setupTestMembership({db});

    const email = user.email;
    const role = "member";
    const organizationId = org.id;
    const userId = user.id;

    try {
      await createInvitation({db})({
        email,
        role,
        organizationId,
        userId,
      });
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof Error) {
        expect(error.message).toBe(
          "User is already a member of this organization.",
        );
      } else {
        throw error;
      }
    }
  });

  it("should create an invitation for existing user, but without same org membership", async () => {
    const {user} = await setupTestMembership({db});
    const otherOrg = await createTestOrganization({db});

    const email = user.email;
    const role = "member";
    const userId = user.id;

    const invitation = await createInvitation({db})({
      email,
      role,
      organizationId: otherOrg.id,
      userId,
    });

    expect(invitation).toBeDefined();
    expect(invitation.email).toBe(email);
    expect(invitation.role).toBe(role);
    expect(invitation.organizationId).toBe(otherOrg.id);
    expect(invitation.inviterId).toBe(userId);
  });
});
