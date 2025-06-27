import {afterEach, describe, expect, it} from "bun:test";

import {createTestVerificationToken} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {getVerificationToken} from "../queries/get-verification-token";
import {deleteVerificationToken} from "./delete-verification-token";

describe("deleteVerificationToken", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  it("should delete verification token by identifier", async () => {
    const email = "test@example.com";

    const createdToken = await createTestVerificationToken({
      db,
      overrides: {value: email},
    });

    expect(createdToken).toBeDefined();

    await deleteVerificationToken({db})({token: createdToken!.identifier});

    const tokenAfterDelete = await getVerificationToken({db})({
      token: createdToken!.identifier,
    });
    expect(tokenAfterDelete).toBeNull();
  });

  it("should handle deleting non-existent verification token", async () => {
    const nonExistentToken = "non-existent-token";

    await deleteVerificationToken({db})({token: nonExistentToken});

    const token = await getVerificationToken({db})({token: nonExistentToken});
    expect(token).toBeNull();
  });
});
