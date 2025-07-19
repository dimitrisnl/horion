import {afterEach, describe, expect, it} from "bun:test";

import {
  createTestMembership,
  createTestOrganization,
  createTestUser,
  setupTestMembership,
} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {
  findMembership,
  findMembershipsByOrganizationId,
  findMembershipsByUserId,
} from "./queries";

describe("Membership Queries", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("findMembership", async () => {
    it("should return membership when user is member of organization", async () => {
      const {user, org} = await setupTestMembership({db});

      const membership = await findMembership({
        db,
        organizationId: org.id,
        userId: user.id,
      });

      expect(membership).toBeDefined();
      expect(membership!.userId).toBe(user.id);
      expect(membership!.organizationId).toBe(org!.id);
      expect(membership!.role).toBe("owner");
      expect(membership!.createdAt).toBeInstanceOf(Date);
    });

    it("should return null when user is not member of organization", async () => {
      const {org} = await setupTestMembership({db});
      const rogueUser = await createTestUser({db});

      const membership = await findMembership({
        db,
        organizationId: org.id,
        userId: rogueUser.id,
      });
      expect(membership).toBeNull();
    });

    it("should return null for non-existent organization", async () => {
      const createdUser = await createTestUser({db});

      const result = await findMembership({
        db,
        organizationId: generateId(),
        userId: createdUser!.id,
      });

      expect(result).toBeNull();
    });
  });

  describe("findMembershipsByUserId", async () => {
    it("should return memberships for user", async () => {
      const {user, org} = await setupTestMembership({db});

      const memberships = await findMembershipsByUserId({
        db,
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

      const memberships = await findMembershipsByUserId({
        db,
        userId: createdUser!.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships!.length).toBe(0);
    });

    it("should return multiple memberships ordered by creation date", async () => {
      const user = await createTestUser({db});
      const createdOrganization1 = await createTestOrganization({
        db,
      });
      const createdOrganization2 = await createTestOrganization({
        db,
      });

      await createTestMembership({
        db,
        overrides: {
          userId: user!.id,
          organizationId: createdOrganization1.id,
          role: "owner",
        },
      });

      await createTestMembership({
        db,
        overrides: {
          userId: user!.id,
          organizationId: createdOrganization2.id,
          role: "owner",
        },
      });

      const memberships = await findMembershipsByUserId({
        db,
        userId: user!.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships!.length).toBe(2);

      expect(memberships[0].createdAt.getTime()).toBeLessThanOrEqual(
        memberships[1].createdAt.getTime(),
      );

      memberships!.forEach((membership) => {
        expect(membership.role).toBe("owner");
        expect(membership.organizationId).toBeDefined();
        expect(membership.organizationName).toBeDefined();
      });
    });
  });

  describe("findMembershipsByOrganizationId", async () => {
    it("should return memberships for organization", async () => {
      const {org} = await setupTestMembership({db});

      const memberships = await findMembershipsByOrganizationId({
        db,
        organizationId: org.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships!.length).toBe(1);
      expect(memberships![0].role).toBe("owner");
    });

    it("should return empty array when organization has no memberships", async () => {
      const createdOrganization = await createTestOrganization({db});

      const memberships = await findMembershipsByOrganizationId({
        db,
        organizationId: createdOrganization.id,
      });

      expect(memberships).toBeDefined();
      expect(memberships!.length).toBe(0);
    });
  });
});
