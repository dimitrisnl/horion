import {Hono} from "hono";

import {beforeEach, describe, expect, it} from "bun:test";

import {setupRateLimiting} from "./rate-limit";

describe("Rate Limiting", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use("/*", setupRateLimiting());

    app.get("/test", (ctx) => ctx.json({message: "success"}));
    app.get("/auth/test", (ctx) => ctx.json({message: "auth success"}));
  });

  describe("General Rate Limit", () => {
    it("should allow requests within rate limit", async () => {
      // Make 5 requests (within the general limit of 100 per minute)
      for (let index = 0; index < 5; index++) {
        const response = await app.request("/test", {
          headers: {
            "x-forwarded-for": `192.168.1.1`,
          },
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({message: "success"});
      }
    });

    it("should return 429 when rate limit is exceeded", async () => {
      const testIP = "10.0.0.1";

      // Make 100 requests (at the limit)
      for (let index = 0; index < 100; index++) {
        const response = await app.request("/test", {
          headers: {
            "x-forwarded-for": testIP,
          },
        });
        expect(response.status).toBe(200);
      }

      // The 101st request should be rate limited
      const response = await app.request("/test", {
        headers: {
          "x-forwarded-for": testIP,
        },
      });
      expect(response.status).toBe(429);
    });
  });

  describe("Auth Rate Limit", () => {
    it("should allow requests within rate limit", async () => {
      for (let index = 0; index < 5; index++) {
        const response = await app.request("/auth/test", {
          headers: {
            "x-forwarded-for": `172.16.1.1`,
          },
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({message: "auth success"});
      }
    });

    it("should return 429 when rate limit is exceeded", async () => {
      const testIP = "172.16.2.1";

      // Make 5 requests (at the limit)
      for (let index = 0; index < 5; index++) {
        const response = await app.request("/auth/test", {
          headers: {
            "x-forwarded-for": testIP,
          },
        });
        expect(response.status).toBe(200);
      }

      // The 6th request should be rate limited
      const response = await app.request("/auth/test", {
        headers: {
          "x-forwarded-for": testIP,
        },
      });
      expect(response.status).toBe(429);
    });
  });
});
