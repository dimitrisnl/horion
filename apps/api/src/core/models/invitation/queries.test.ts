import {afterEach, describe, expect, it} from "bun:test";

import {createTestInvitation, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {
  findInvitationByEmailAndOrganizationId,
  findInvitationById,
  findInvitationsByOrganizationId,
} from "./queries";

describe("Invitation Queries", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("findInvitationById", async () => {
    it("should return invitation by ID", async () => {
      const {user, org} = await setupTestMembership({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const foundInvitation = await findInvitationById({
        db,
        invitationId: invitation.id,
      });

      expect(foundInvitation).toBeDefined();
      expect(foundInvitation!.id).toBe(invitation.id);
      expect(foundInvitation!.email).toBe(invitation.email);
    });

    it("should return null for non-existent invitation ID", async () => {
      const foundInvitation = await findInvitationById({
        db,
        invitationId: generateId(),
      });

      expect(foundInvitation).toBeNull();
    });
  });

  describe("findInvitationByToken", async () => {
    it("should return invitation by token", async () => {
      const {user, org} = await setupTestMembership({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const foundInvitation = await findInvitationById({
        db,
        invitationId: invitation.id,
      });

      expect(foundInvitation).toBeDefined();
      expect(foundInvitation!.id).toBe(invitation.id);
      expect(foundInvitation!.email).toBe(invitation.email);
    });

    it("should return null for non-existent invitation token", async () => {
      const foundInvitation = await findInvitationById({
        db,
        invitationId: generateId(),
      });

      expect(foundInvitation).toBeNull();
    });
  });

  describe("findInvitationsByOrganizationId", async () => {
    it("should return invitations for organization", async () => {
      const {user, org} = await setupTestMembership({db});

      const invitation1 = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const invitation2 = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const invitations = await findInvitationsByOrganizationId({
        db,
        organizationId: org.id,
      });

      expect(invitations).toBeDefined();
      expect(Array.isArray(invitations)).toBe(true);
      expect(invitations.length).toBe(2);
      expect(invitations[0].id).toBe(invitation1.id);
      expect(invitations[1].id).toBe(invitation2.id);
      expect(invitations[0].email).toBe(invitation1.email);
      expect(invitations[1].email).toBe(invitation2.email);
    });

    it("should return an empty array if no invitations exist for the org", async () => {
      const {org} = await setupTestMembership({db});

      const invitations = await findInvitationsByOrganizationId({
        db,
        organizationId: org.id,
      });

      expect(invitations).toBeDefined();
      expect(Array.isArray(invitations)).toBe(true);
      expect(invitations.length).toBe(0);
    });
  });

  describe("findInvitationByEmailAndOrganizationId", async () => {
    it("should return invitation by email and organization ID", async () => {
      const {user, org} = await setupTestMembership({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const foundInvitation = await findInvitationByEmailAndOrganizationId({
        db,
        email: invitation.email,
        organizationId: org.id,
      });

      expect(foundInvitation).toBeDefined();
      expect(foundInvitation!.id).toBe(invitation.id);
      expect(foundInvitation!.email).toBe(invitation.email);
    });

    it("should return null for non-existent email", async () => {
      const {org} = await setupTestMembership({db});

      const foundInvitation = await findInvitationByEmailAndOrganizationId({
        db,
        email: "<non-existent-email>",
        organizationId: org.id,
      });

      expect(foundInvitation).toBeNull();
    });

    it("should return null for non-existent organization ID", async () => {
      const foundInvitation = await findInvitationByEmailAndOrganizationId({
        db,
        email: "<non-existent-email>",
        organizationId: generateId(),
      });

      expect(foundInvitation).toBeNull();
    });
  });
});
