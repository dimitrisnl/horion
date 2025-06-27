import {Hono} from "hono";
import {logger} from "hono/logger";
import {secureHeaders} from "hono/secure-headers";
import {timeout} from "hono/timeout";

import {setupClientHints, setupCors, setupRPC} from "~/app/setup";
import {envVars} from "~/config";

import {httpRouter} from "./routes/http";

const app = new Hono();

// Configure middleware
app.use(logger());
app.use(secureHeaders());
app.use("/*", setupClientHints());
app.use("/*", setupCors());
app.use("/*", timeout(5000));

// Configure RPC
app.use("/rpc/*", setupRPC());

// Configure HTTP routes
app.get("/auth/verify", httpRouter["/auth/verify"].GET);
app.get("/", httpRouter["/"].GET);

export default {
  hostname: "0.0.0.0",
  port: envVars.PORT,
  fetch: app.fetch,
  maxRequestBodySize: 50 * 1024, // 50 KB
};
