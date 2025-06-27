import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {nanoid} from "nanoid";

export const createTestUser = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.users.$inferInsert>;
}) => {
  const identifier = nanoid();
  const defaultUser = {
    id: `user_${identifier}`,
    name: "Test User",
    email: `test-${identifier}@example.com`,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userData = {...defaultUser, ...overrides};
  await db.insert(schema.users).values(userData);

  return userData;
};

export const createTestSession = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.sessions.$inferInsert>;
}) => {
  const identifier = nanoid();

  const defaultSession = {
    id: `session_${identifier}`,
    token: `token_${identifier}`,
    userId: `user_${identifier}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sessionData = {...defaultSession, ...overrides};
  await db.insert(schema.sessions).values(sessionData);

  return sessionData;
};

export const createTestOrganization = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.organizations.$inferInsert>;
}) => {
  const identifier = nanoid();

  const defaultOrg = {
    id: `org_${identifier}`,
    name: `Test Organization ${identifier}`,
    createdAt: new Date(),
  };

  const orgData = {...defaultOrg, ...overrides};
  await db.insert(schema.organizations).values(orgData);

  return orgData;
};

export const createTestMembership = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.memberships.$inferInsert>;
}) => {
  const identifier = nanoid();

  const defaultMembership = {
    id: `membership_${identifier}`,
    userId: `user_${identifier}`,
    organizationId: `org_${identifier}`,
    role: "owner",
    createdAt: new Date(),
  };

  const membershipData = {...defaultMembership, ...overrides};
  await db.insert(schema.memberships).values(membershipData);

  return membershipData;
};

export const createTestSessionMetadata = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.sessionMetadata.$inferInsert>;
}) => {
  const identifier = nanoid();

  const defaultSessionMetadata = {
    id: `session_metadata_${identifier}`,
    sessionId: `session_${identifier}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    browser: "Chrome",
    os: "macOS",
    device: "desktop",
    engine: "Blink",
    model: "MacBook Pro",
    userAgent: "Mozilla/5.0...",
    ipAddress: "127.0.0.1",
  };

  const sessionMetadataData = {...defaultSessionMetadata, ...overrides};
  await db.insert(schema.sessionMetadata).values(sessionMetadataData);

  return sessionMetadataData;
};

export const createTestVerificationToken = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.verifications.$inferInsert>;
}) => {
  const identifier = nanoid();

  const defaultVerificationToken = {
    id: `verification_id_${identifier}`,
    identifier: `verification_identifier_${identifier}`,
    value: `verification_value_${identifier}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const verificationTokenData = {...defaultVerificationToken, ...overrides};
  await db.insert(schema.verifications).values(verificationTokenData);

  return verificationTokenData;
};

export const setupTestMembership = async ({
  db,
  overrides = {},
}: {
  db: Database;
  overrides?: Partial<typeof schema.memberships.$inferInsert>;
}) => {
  const user = await createTestUser({db});
  const org = await createTestOrganization({db});

  const membership = await createTestMembership({
    db,
    overrides: {
      userId: user.id,
      organizationId: org.id,
      role: "owner",
      ...overrides,
    },
  });

  return {user, org, membership};
};
