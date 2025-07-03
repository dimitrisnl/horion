import {afterEach, describe, expect, it} from "bun:test";

import {createTestOrganization} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {findOrganization} from "./queries";

describe("Organization Queries", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });
  describe("findOrganization", async () => {
    it("should return organization when it exists", async () => {
      const createdOrg = await createTestOrganization({db});

      const result = await findOrganization({
        db,
        organizationId: createdOrg!.id,
      });

      expect(result).toBeDefined();
      expect(result!.id).toBe(createdOrg!.id);
    });

    it("should return null for non-existent organization", async () => {
      const organization = await findOrganization({
        db,
        organizationId: generateId(),
      });

      expect(organization).toBeNull();
    });
  });
});
