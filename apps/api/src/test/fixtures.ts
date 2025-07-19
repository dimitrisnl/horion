import * as schema from "@horionos/db/schema";

import {nanoid} from "nanoid";

import {generateId} from "~/models/id";
import {generateToken} from "~/models/token";
import type {DatabaseConnection} from "~/types/database";

export const createTestUser = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.users.$inferInsert>;
}) => {
  const identifier = generateId();
  const defaultUser = {
    id: identifier,
    name: "Test User",
    email: `test-${identifier}@example.com`.toLowerCase(),
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [user] = await db
    .insert(schema.users)
    .values({...defaultUser, ...overrides})
    .returning();

  return user;
};

export const createTestSession = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.sessions.$inferInsert>;
}) => {
  const defaultSession = {
    id: generateId(),
    token: generateToken(),
    userId: generateId(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [session] = await db
    .insert(schema.sessions)
    .values({...defaultSession, ...overrides})
    .returning();

  return session;
};

export const createTestOrganization = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.organizations.$inferInsert>;
}) => {
  const identifier = generateId();

  const defaultOrg = {
    id: identifier,
    name: `Test Organization ${identifier}`,
    createdAt: new Date(),
  };

  const [organization] = await db
    .insert(schema.organizations)
    .values({...defaultOrg, ...overrides})
    .returning();

  return organization;
};

export const createTestMembership = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.memberships.$inferInsert>;
}) => {
  const defaultMembership = {
    id: generateId(),
    userId: generateId(),
    organizationId: generateId(),
    role: "owner",
    createdAt: new Date(),
  } as const;

  const [membership] = await db
    .insert(schema.memberships)
    .values({...defaultMembership, ...overrides})
    .returning();

  return membership;
};

export const createTestSessionMetadata = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.sessionMetadata.$inferInsert>;
}) => {
  const defaultSessionMetadata = {
    id: generateId(),
    sessionId: generateId(),
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

  const [sessionMetadata] = await db
    .insert(schema.sessionMetadata)
    .values({...defaultSessionMetadata, ...overrides})
    .returning();

  return sessionMetadata;
};

export const createTestVerificationToken = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.verifications.$inferInsert>;
}) => {
  const identifier = nanoid();

  const defaultVerificationToken = {
    id: identifier,
    identifier: generateToken(),
    value: `email_${identifier}@example.com`.toLowerCase(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [verification] = await db
    .insert(schema.verifications)
    .values({...defaultVerificationToken, ...overrides})
    .returning();

  return verification;
};

export const setupTestMembership = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
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

export const createTestInvitation = async ({
  db,
  overrides = {},
}: {
  db: DatabaseConnection;
  overrides?: Partial<typeof schema.invitations.$inferInsert>;
}) => {
  const identifier = generateId();

  const defaultInvitation = {
    id: identifier,
    token: generateToken(),
    email: `email_${identifier}@example.com`.toLowerCase(),
    status: "pending",
    organizationId: generateId(),
    inviterId: generateId(),
    role: "member",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const;

  const invitationData = {...defaultInvitation, ...overrides};
  const [invitation] = await db
    .insert(schema.invitations)
    .values(invitationData)
    .returning();

  return invitation;
};
