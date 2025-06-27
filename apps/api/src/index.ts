import {Hono} from "hono";
import {logger} from "hono/logger";
import {secureHeaders} from "hono/secure-headers";

import {setupClientHints, setupCors, setupRPC} from "~/app/setup";
import {envVars} from "~/config";

import {httpRouter} from "./routes/http";

const app = new Hono();

// Configure middleware
app.use(logger());
app.use(secureHeaders());
app.use("/*", setupClientHints());
app.use("/*", setupCors());

// Configure RPC
app.use("/rpc/*", setupRPC());

// Configure HTTP routes
app.get("/auth/verify", httpRouter["/auth/verify"].GET);
app.get("/", httpRouter["/"].GET);

export default {
  hostname: "0.0.0.0",
  port: envVars.PORT,
  fetch: app.fetch,
};
