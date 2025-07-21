import {Hono} from "hono";

import {beforeEach, describe, expect, it} from "bun:test";

import {setupClientHints} from "./client-hints";

describe("Client Hints Middleware", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use("/*", setupClientHints());

    app.get("/test", (ctx) => ctx.json({message: "success"}));
  });

  it("should set Accept-CH header with all client hints", async () => {
    const response = await app.request("/test");

    expect(response.status).toBe(200);
    expect(response.headers.get("Accept-CH")).toBe(
      "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Model, Sec-CH-UA-Bitness",
    );
  });

  it("should set Critical-CH header with critical hints only", async () => {
    const response = await app.request("/test");

    expect(response.status).toBe(200);
    expect(response.headers.get("Critical-CH")).toBe(
      "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform",
    );
  });

  it("should set both headers on any route", async () => {
    const response = await app.request("/any/route/path");

    expect(response.status).toBe(404); // Route doesn't exist, but middleware should still run
    expect(response.headers.get("Accept-CH")).toBe(
      "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Model, Sec-CH-UA-Bitness",
    );
    expect(response.headers.get("Critical-CH")).toBe(
      "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform",
    );
  });
});
