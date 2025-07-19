import {afterEach, describe, expect, it} from "bun:test";

import {createTestSession, createTestUser} from "~/test/fixtures";
import {cleanupTestDatabase, createTestDatabase} from "~/test/setup";

import {createSessionMetadata} from "./mutations";

describe("Session Metadata Mutations", async () => {
  const {client, db} = await createTestDatabase();

  afterEach(async () => {
    await cleanupTestDatabase(client);
  });

  describe("createSessionMetadata", async () => {
    it("should create session metadata with all required fields", async () => {
      const email = "test@example.com";

      const createdUser = await createTestUser({db, overrides: {email}});

      const createdSession = await createTestSession({
        db,
        overrides: {userId: createdUser!.id},
      });

      const metadata = await createSessionMetadata({
        db,
        sessionId: createdSession!.id,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        browser: "Chrome",
        os: "macOS",
        device: "desktop",
        engine: "Blink",
        model: "MacBook Pro",
        ipAddress: "127.0.0.1",
      });

      expect(metadata!.id).toBeDefined();
      expect(metadata!.sessionId).toBe(createdSession!.id);
      expect(metadata!.userAgent).toBe(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      );
      expect(metadata!.browser).toBe("Chrome");
      expect(metadata!.os).toBe("macOS");
      expect(metadata!.device).toBe("desktop");
      expect(metadata!.engine).toBe("Blink");
      expect(metadata!.model).toBe("MacBook Pro");
      expect(metadata!.ipAddress).toBe("127.0.0.1");
    });
  });
});
