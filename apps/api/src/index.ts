import {Hono} from "hono";
import {secureHeaders} from "hono/secure-headers";
import {timeout} from "hono/timeout";

import {envVars} from "~/config/env";
import {setupCrons} from "~/jobs";
import {setupClientHints} from "~/middleware/client-hints";
import {setupCors} from "~/middleware/cors";
import {logger, setupLogger} from "~/middleware/logger";
import {setupRateLimiting} from "~/middleware/rate-limit";
import {setupRPC} from "~/middleware/rpc";
import {restRouter} from "~/routes/rest";

const app = new Hono();

// Configure middleware
app.use(setupLogger());
app.use(secureHeaders());
app.use("/*", setupClientHints());
app.use("/*", setupCors());
app.use("/*", timeout(5000));

// Apply rate limiting to all routes
app.use("/*", setupRateLimiting());

// Configure RPC
app.use("/rpc/*", setupRPC());

// Configure REST routes
app.get("/", restRouter["/"].GET);

// Start cron jobs
setupCrons();

logger.info(
  {port: envVars.PORT, environment: envVars.BUN_ENVIRONMENT},
  "API server starting",
);

export default {
  hostname: "0.0.0.0",
  port: envVars.PORT,
  fetch: app.fetch,
  maxRequestBodySize: 50 * 1024, // 50 KB
};
