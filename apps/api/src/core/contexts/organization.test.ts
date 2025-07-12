import {afterEach, describe, expect, it} from "bun:test";

import {
  createTestInvitation,
  createTestMembership,
  createTestOrganization,
  createTestUser,
  setupTestMembership,
} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {
  InvitationAlreadyExistsError,
  InvitationNotFoundError,
  MembershipAlreadyExistsError,
  OrganizationNotFoundError,
} from "../errors/error-types";
import {generateId} from "../models/id";
import {OrganizationContext} from "./organization";

describe("Organization Context", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("getOrganization", async () => {
    it("should return organization for valid membership", async () => {
      const {user, org} = await setupTestMembership({db});

      const foundOrganization = await OrganizationContext.getOrganization({
        db,
        organizationId: org.id,
        actorId: user.id,
      });

      expect(foundOrganization).toBeDefined();
      expect(foundOrganization.id).toBe(org.id);
    });

    it("should throw error for invalid membership", async () => {
      const user = await createTestUser({db});
      const org = await createTestOrganization({db});

      await expect(
        OrganizationContext.getOrganization({
          db,
          organizationId: org.id,
          actorId: user.id,
        }),
      ).rejects.toThrow(OrganizationNotFoundError);
    });

    it("should throw error for non-existent organization", async () => {
      const {user} = await setupTestMembership({db});

      await expect(
        OrganizationContext.getOrganization({
          db,
          organizationId: generateId(),
          actorId: user.id,
        }),
      ).rejects.toThrow(OrganizationNotFoundError);
    });
  });

  describe("createOrganization", async () => {
    it("should create organization and membership", async () => {
      const user = await createTestUser({db});

      const {organization, membership} =
        await OrganizationContext.createOrganization({
          db,
          name: "Test Organization",
          actorId: user.id,
        });

      expect(organization).toBeDefined();
      expect(organization.name).toBe("Test Organization");
      expect(organization.id).toBeDefined();

      expect(membership).toBeDefined();
      expect(membership.role).toBe("owner");
    });

    it("should throw error if organization creation fails", async () => {
      expect(
        OrganizationContext.createOrganization({
          db,
          name: "",
          actorId: generateId(),
        }),
      ).rejects.toThrow();
    });
  });
  describe("updateOrganization", async () => {
    it("should update organization name", async () => {
      const {org, user} = await setupTestMembership({db});

      const updatedOrg = await OrganizationContext.updateOrganization({
        db,
        organizationId: org.id,
        name: "Updated Organization",
        actorId: user.id,
      });

      expect(updatedOrg).toBeDefined();
      expect(updatedOrg!.name).toBe("Updated Organization");
    });

    it("should throw error if organization not found", async () => {
      const user = await createTestUser({db});

      expect(
        OrganizationContext.updateOrganization({
          db,
          organizationId: generateId(),
          name: "Updated Organization",
          actorId: user.id,
        }),
      ).rejects.toThrow(OrganizationNotFoundError);
    });

    it("should throw error if user is not a member", async () => {
      const {org, user} = await setupTestMembership({
        db,
        overrides: {role: "member"},
      });

      expect(
        OrganizationContext.updateOrganization({
          db,
          organizationId: org.id,
          name: "Updated Organization",
          actorId: user.id,
        }),
      ).rejects.toThrow("Only admins and owners can update the organization.");
    });
  });

  describe("createInvitation", async () => {
    it("should create an invitation for a user", async () => {
      const {org, user} = await setupTestMembership({db});

      const {invitation, invitee} = await OrganizationContext.createInvitation({
        db,
        email: "test@example.com",
        role: "member",
        organizationId: org.id,
        actorId: user.id,
      });

      expect(invitation).toBeDefined();
      expect(invitation.email).toBe("test@example.com");
      expect(invitation.role).toBe("member");
      expect(invitation.organizationId).toBe(org.id);
      expect(invitation.inviterId).toBe(user.id);
      expect(invitee).toBeNull();
    });

    it("should find the existing app user", async () => {
      const {org, user} = await setupTestMembership({db});
      const inviteeUser = await createTestUser({db});

      const {invitation, invitee} = await OrganizationContext.createInvitation({
        db,
        email: inviteeUser.email,
        role: "member",
        organizationId: org.id,
        actorId: user.id,
      });

      expect(invitation).toBeDefined();
      expect(invitation.email).toBe(inviteeUser.email);
      expect(invitation.role).toBe("member");
      expect(invitation.organizationId).toBe(org.id);
      expect(invitation.inviterId).toBe(user.id);
      expect(invitee?.id).toBe(inviteeUser.id);
    });

    it("should throw error if user is not a member", async () => {
      const user = await createTestUser({db});
      const org = await createTestOrganization({db});

      expect(
        OrganizationContext.createInvitation({
          db,
          email: "test@example.com",
          role: "member",
          organizationId: org.id,
          actorId: user.id,
        }),
      ).rejects.toThrow(OrganizationNotFoundError);
    });

    it("should throw error if user is not an admin or owner", async () => {
      const {org, user} = await setupTestMembership({
        db,
        overrides: {role: "member"},
      });

      expect(
        OrganizationContext.createInvitation({
          db,
          email: "test@example.com",
          role: "member",
          organizationId: org.id,
          actorId: user.id,
        }),
      ).rejects.toThrow("Only admins and owners can create invitations.");
    });

    it("should throw error if the invitation already exists", async () => {
      const {org, user} = await setupTestMembership({db});

      await OrganizationContext.createInvitation({
        db,
        email: "test@example.com",
        role: "member",
        organizationId: org.id,
        actorId: user.id,
      });

      expect(
        OrganizationContext.createInvitation({
          db,
          email: "test@example.com",
          role: "member",
          organizationId: org.id,
          actorId: user.id,
        }),
      ).rejects.toThrow(InvitationAlreadyExistsError);
    });

    it("should throw error if the user is already a member", async () => {
      const {org, user} = await setupTestMembership({db});
      const invitee = await createTestUser({db});
      await createTestMembership({
        db,
        overrides: {organizationId: org.id, userId: invitee.id},
      });

      expect(
        OrganizationContext.createInvitation({
          db,
          email: invitee.email,
          role: "member",
          organizationId: org.id,
          actorId: user.id,
        }),
      ).rejects.toThrow("User is already a member of this organization.");
    });

    it("should throw error if the invitee is the invitee", async () => {
      const {org, user} = await setupTestMembership({db});

      expect(
        OrganizationContext.createInvitation({
          db,
          email: user.email,
          role: "member",
          organizationId: org.id,
          actorId: user.id,
        }),
      ).rejects.toThrow(MembershipAlreadyExistsError);
    });
  });

  describe("getInvitations", async () => {
    it("should return invitations for the organization", async () => {
      const {org, user} = await setupTestMembership({db});
      const invitee = await createTestUser({db});

      await OrganizationContext.createInvitation({
        db,
        email: invitee.email,
        role: "member",
        organizationId: org.id,
        actorId: user.id,
      });

      const invitations = await OrganizationContext.getInvitations({
        db,
        organizationId: org.id,
        userId: user.id,
      });

      expect(invitations).toBeDefined();
      expect(invitations.length).toBe(1);
      expect(invitations[0].email).toBe(invitee.email);
    });

    it("should return empty array if no invitations", async () => {
      const {org, user} = await setupTestMembership({db});

      const invitations = await OrganizationContext.getInvitations({
        db,
        organizationId: org.id,
        userId: user.id,
      });

      expect(invitations).toBeDefined();
      expect(invitations.length).toBe(0);
    });

    it("should throw error if user is not a member", async () => {
      const user = await createTestUser({db});
      const org = await createTestOrganization({db});

      expect(
        OrganizationContext.getInvitations({
          db,
          organizationId: org.id,
          userId: user.id,
        }),
      ).rejects.toThrow(OrganizationNotFoundError);
    });

    it("should throw error if not an admin or owner", async () => {
      const {user, org} = await setupTestMembership({
        db,
        overrides: {role: "member"},
      });

      expect(
        OrganizationContext.getInvitations({
          db,
          organizationId: org.id,
          userId: user.id,
        }),
      ).rejects.toThrow("Only admins and owners can view invitations.");
    });
  });
  describe("deleteInvitation", async () => {
    it("should delete an invitation", async () => {
      const {org, user} = await setupTestMembership({db});
      const invitee = await createTestUser({db});

      const {invitation} = await OrganizationContext.createInvitation({
        db,
        email: invitee.email,
        role: "member",
        organizationId: org.id,
        actorId: user.id,
      });

      const result = await OrganizationContext.deleteInvitation({
        db,
        invitationId: invitation.id,
        actorId: user.id,
        organizationId: org.id,
      });

      expect(result?.id).toBe(invitation.id);
    });

    it("should throw error if invitation not found", async () => {
      const {org, user} = await setupTestMembership({db});

      expect(
        OrganizationContext.deleteInvitation({
          db,
          invitationId: generateId(),
          actorId: user.id,
          organizationId: org.id,
        }),
      ).rejects.toThrow(InvitationNotFoundError);
    });

    it("should throw error if user is not a member", async () => {
      const user = await createTestUser({db});
      const org = await createTestOrganization({db});

      expect(
        OrganizationContext.deleteInvitation({
          db,
          invitationId: generateId(),
          actorId: user.id,
          organizationId: org.id,
        }),
      ).rejects.toThrow(OrganizationNotFoundError);
    });

    it("should throw error if not an admin or owner", async () => {
      const {org, user} = await setupTestMembership({
        db,
        overrides: {role: "member"},
      });
      const admin = await createTestUser({db});
      await createTestMembership({
        db,
        overrides: {organizationId: org.id, userId: admin.id, role: "admin"},
      });

      const invitation = await createTestInvitation({
        db,
        overrides: {organizationId: org.id, inviterId: admin.id},
      });

      expect(
        OrganizationContext.deleteInvitation({
          db,
          invitationId: invitation.id,
          actorId: user.id,
          organizationId: org.id,
        }),
      ).rejects.toThrow("Only admins and owners can delete invitations.");
    });
  });
});
