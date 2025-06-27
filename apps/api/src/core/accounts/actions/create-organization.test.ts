import * as schema from "@horionos/db/schema";

import {afterEach, describe, expect, it} from "bun:test";
import {eq} from "drizzle-orm";

import {createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createOrganization} from "./create-organization";

describe("createOrganization", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should create a new organization with valid data", async () => {
    const email = "test@example.com";
    const orgName = "Test Organization";

    const createdUser = await createTestUser({db, overrides: {email}});

    const createdOrganization = await createOrganization({db})({
      name: orgName,
      userId: createdUser!.id,
    });

    expect(createdOrganization).toBeDefined();
    expect(createdOrganization!.name).toBe(orgName);
    expect(createdOrganization!.id).toBeDefined();
    expect(createdOrganization!.createdAt).toBeInstanceOf(Date);
  });

  it("should create organization with unique ID", async () => {
    const email = "test@example.com";
    const orgName1 = "First Organization";
    const orgName2 = "Second Organization";

    const createdUser = await createTestUser({db, overrides: {email}});

    const createdOrg1 = await createOrganization({db})({
      name: orgName1,
      userId: createdUser!.id,
    });

    const createdOrg2 = await createOrganization({db})({
      name: orgName2,
      userId: createdUser!.id,
    });

    expect(createdOrg1!.id).not.toBe(createdOrg2!.id);
  });

  it("should create membership for the user with owner role", async () => {
    const email = "test@example.com";
    const orgName = "Test Organization";

    const createdUser = await createTestUser({db, overrides: {email}});

    const createdOrganization = await createOrganization({db})({
      name: orgName,
      userId: createdUser!.id,
    });

    const membership = await db
      .select()
      .from(schema.memberships)
      .where(eq(schema.memberships.organizationId, createdOrganization!.id));

    expect(membership).toBeDefined();
    expect(membership!.length).toBe(1);
    expect(membership![0].role).toBe("owner");
    expect(membership![0].userId).toBe(createdUser!.id);
    expect(membership![0].organizationId).toBe(createdOrganization!.id);
  });
});
