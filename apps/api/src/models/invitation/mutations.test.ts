import {afterEach, describe, expect, it} from "bun:test";

import {InvitationAlreadyExistsError, InvitationNotFoundError} from "~/errors";
import {createTestInvitation, setupTestMembership} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {
  createInvitation,
  declineInvitation,
  deleteInvitation,
} from "./mutations";
import {findInvitationById} from "./queries";

describe("Invitation Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("createInvitation", async () => {
    it("should create a new invitation with valid data", async () => {
      const email = "test@example.com";
      const role = "member";
      const {user, org} = await setupTestMembership({db});

      const invitation = await createInvitation({
        db,
        email,
        role,
        inviterId: user.id,
        organizationId: org.id,
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

      await createInvitation({
        db,
        email,
        role,
        inviterId: user.id,
        organizationId: org.id,
      });

      expect(
        createInvitation({
          db,
          email,
          role,
          inviterId: user.id,
          organizationId: org.id,
        }),
      ).rejects.toThrow(InvitationAlreadyExistsError);
    });

    it("should throw an error if role is invalid", async () => {
      const email = "test@example.com";
      const {user, org} = await setupTestMembership({db});

      expect(
        createInvitation({
          db,
          email,
          role: "invalid_role" as never,
          inviterId: user.id,
          organizationId: org.id,
        }),
      ).rejects.toThrow();
    });

    it("should set the correct expiration time", async () => {
      const email = "test@example.com";
      const {user, org} = await setupTestMembership({db});

      const invitation = await createInvitation({
        db,
        email,
        role: "member",
        inviterId: user.id,
        organizationId: org.id,
      });

      expect(invitation).toBeDefined();
      expect(invitation.expiresAt).toBeDefined();
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      expect(invitation.expiresAt.getTime()).toBeLessThanOrEqual(
        sevenDaysFromNow.getTime(),
      );
    });
  });

  describe("deleteInvitation", async () => {
    it("should delete an invitation by ID", async () => {
      const {user, org} = await setupTestMembership({db});
      const invitation = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const deletedInvitation = await deleteInvitation({
        db,
        id: invitation.id,
        organizationId: org.id,
      });

      expect(deletedInvitation).toBeDefined();
      expect(deletedInvitation!.id).toBe(invitation.id);
    });

    it("should return null if invitation does not exist", async () => {
      const {org} = await setupTestMembership({db});

      const deletedInvitation = await deleteInvitation({
        db,
        id: generateId(),
        organizationId: org.id,
      });

      expect(deletedInvitation).toBeNull();
    });

    it("should return null if organization does not match", async () => {
      const {user, org} = await setupTestMembership({db});

      const invitation = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      const deletedInvitation = await deleteInvitation({
        db,
        id: invitation.id,
        organizationId: generateId(),
      });

      expect(deletedInvitation).toBeNull();
    });
  });

  describe("declineInvitation", async () => {
    it("should decline an invitation", async () => {
      const {user, org} = await setupTestMembership({db});
      const invitation = await createTestInvitation({
        db,
        overrides: {inviterId: user.id, organizationId: org.id},
      });

      await declineInvitation({db, id: invitation.id});

      const expectedInvitation = await findInvitationById({
        db,
        invitationId: invitation.id,
      });

      expect(expectedInvitation).toBeDefined();
      expect(expectedInvitation!.id).toBe(invitation.id);
      expect(expectedInvitation!.status).toBe("declined");
    });

    it("should throw error if the invitation doesn't exist", async () => {
      await setupTestMembership({db});

      expect(
        declineInvitation({
          db,
          id: generateId(),
        }),
      ).rejects.toThrow(InvitationNotFoundError);
    });
  });
});
