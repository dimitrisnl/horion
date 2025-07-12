import {afterEach, describe, expect, it} from "bun:test";

import {createTestOrganization, createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createMembership} from "./mutations";

describe("Membership Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("createMembership", async () => {
    it("should create a new membership", async () => {
      const user = await createTestUser({db});
      const organization = await createTestOrganization({db});

      const createdMembership = await createMembership({
        db,
        userId: user.id,
        organizationId: organization.id,
        role: "owner",
      });

      expect(createdMembership.id).toBeDefined();
      expect(createdMembership.userId).toBe(user.id);
      expect(createdMembership.organizationId).toBe(organization.id);
      expect(createdMembership.role).toBe("owner");
      expect(createdMembership.createdAt).toBeInstanceOf(Date);
      expect(createdMembership.updatedAt).toBeInstanceOf(Date);
    });

    it("should throw if role is invalid", async () => {
      const user = await createTestUser({db});
      const organization = await createTestOrganization({db});

      expect(
        createMembership({
          db,
          userId: user.id,
          organizationId: organization.id,
          role: "invalid-role" as never,
        }),
      ).rejects.toThrow();
    });
  });
});
