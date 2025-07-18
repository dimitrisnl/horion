import {Hono} from "hono";
import {logger} from "hono/logger";
import {secureHeaders} from "hono/secure-headers";
import {timeout} from "hono/timeout";

import {setupClientHints, setupCors, setupRPC} from "~/app/setup";
import {envVars} from "~/config";

import {restRouter} from "./routes/rest";

const app = new Hono();

// Configure middleware
app.use(logger());
app.use(secureHeaders());
app.use("/*", setupClientHints());
app.use("/*", setupCors());
app.use("/*", timeout(5000));

// Configure RPC
app.use("/rpc/*", setupRPC());

// Configure REST routes
app.get("/", restRouter["/"].GET);

export default {
  hostname: "0.0.0.0",
  port: envVars.PORT,
  fetch: app.fetch,
  maxRequestBodySize: 50 * 1024, // 50 KB
};
