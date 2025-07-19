import {afterEach, describe, expect, it} from "bun:test";

import {createTestOrganization} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {generateId} from "../id";
import {createOrganization, updateOrganizationName} from "./mutations";

describe("Organization Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("createOrganization", async () => {
    it("should create a new organization with valid data", async () => {
      const orgName = "Test Organization";

      const createdOrganization = await createOrganization({
        db,
        name: orgName,
      });

      expect(createdOrganization).toBeDefined();
      expect(createdOrganization!.name).toBe(orgName);
      expect(createdOrganization!.id).toBeDefined();
      expect(createdOrganization!.createdAt).toBeInstanceOf(Date);
    });

    it("should create organization with unique ID", async () => {
      const createdOrg1 = await createOrganization({
        db,
        name: "First Organization",
      });

      const createdOrg2 = await createOrganization({
        db,
        name: "Second Organization",
      });

      expect(createdOrg1!.id).not.toBe(createdOrg2!.id);
    });

    it("should throw error when name is too long", async () => {
      const newName = "a".repeat(256);

      expect(createOrganization({db, name: newName})).rejects.toThrow();
    });
  });

  describe("updateOrganizationName", async () => {
    it("should update organization name successfully", async () => {
      const newName = "Updated Organization";

      const createdOrg = await createTestOrganization({db});
      const updatedOrg = await updateOrganizationName({
        db,
        id: createdOrg.id,
        name: newName,
      });

      expect(updatedOrg).toBeDefined();
      expect(updatedOrg!.id).toBe(createdOrg.id);
      expect(updatedOrg!.name).toBe(newName);
    });

    it("should return null for non-existent organization", async () => {
      const newName = "Updated Organization";

      const updatedOrg = await updateOrganizationName({
        db,
        id: generateId(),
        name: newName,
      });

      expect(updatedOrg).toBeNull();
    });

    it("should throw error when name is too long", async () => {
      const newName = "a".repeat(256);

      const createdOrg = await createTestOrganization({db});

      expect(
        updateOrganizationName({db, id: createdOrg.id, name: newName}),
      ).rejects.toThrow();
    });
  });
});
