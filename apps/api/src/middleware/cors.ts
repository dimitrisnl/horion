import {cors} from "hono/cors";

import {envVars} from "~/config/env";

export function setupCors() {
  return cors({
    origin: envVars.DASHBOARD_URL,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}
