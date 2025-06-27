import {Hono} from "hono";
import {cors} from "hono/cors";
import {logger} from "hono/logger";
import {secureHeaders} from "hono/secure-headers";

import {onError} from "@orpc/server";
import {RPCHandler} from "@orpc/server/fetch";
import {ResponseHeadersPlugin} from "@orpc/server/plugins";

import {createContext} from "~/app/context";
import {zodValidationInterceptor} from "~/app/zod-validation-interceptor";
import {envVars} from "~/config";
import {appRouter} from "~/routes/index";
import {clientHints, criticalHints} from "~/utils/fingerprint";

import {verifyMagicLinkRoute} from "./routes/auth";

const app = new Hono();

app.use("*", async (ctx, next) => {
  ctx.header("Accept-CH", clientHints.join(", "));
  ctx.header("Critical-CH", criticalHints.join(", "));
  await next();
});

app.use(secureHeaders());
app.use(logger());

app.use(
  "/*",
  cors({
    origin: envVars.DASHBOARD_URL,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// TODO: include a more restrictive error handler
const handler = new RPCHandler(appRouter, {
  clientInterceptors: [onError((error) => zodValidationInterceptor(error))],
  plugins: [new ResponseHeadersPlugin()],
});

app.use("/rpc/*", async (ctx, next) => {
  const context = await createContext({context: ctx});
  const {matched, response} = await handler.handle(ctx.req.raw, {
    prefix: "/rpc",
    context,
  });

  if (matched) {
    return ctx.newResponse(response.body, response);
  }
  await next();
});

app.get("/auth/verify", verifyMagicLinkRoute);
app.get("/", (ctx) => ctx.text("OK"));

export default {
  port: envVars.PORT,
  // hostname: "0.0.0.0",
  fetch: app.fetch,
};
