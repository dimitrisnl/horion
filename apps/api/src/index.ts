import {Hono} from "hono";
import {cors} from "hono/cors";
import {logger} from "hono/logger";
import {secureHeaders} from "hono/secure-headers";

import {onError} from "@orpc/server";
import {RPCHandler} from "@orpc/server/fetch";

import {envVars} from "./config";
import {auth} from "./lib/auth";
import {createContext} from "./lib/context";
import {zodValidationInterceptor} from "./lib/zod-validation-interceptor";
import {appRouter} from "./routers/index";

const app = new Hono();

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

// Better-auth handler
app.on(["POST", "GET"], "/api/auth/**", (ctx) => auth.handler(ctx.req.raw));

// TODO: include a more restrictive error handler
const handler = new RPCHandler(appRouter, {
  clientInterceptors: [onError((error) => zodValidationInterceptor(error))],
});

app.use("/rpc/*", async (ctx, next) => {
  const context = await createContext({context: ctx});
  const {matched, response} = await handler.handle(ctx.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (matched) {
    return ctx.newResponse(response.body, response);
  }
  await next();
});

app.get("/", (ctx) => {
  return ctx.text("OK");
});

export default {
  port: process.env.PORT ? Number.parseInt(process.env.PORT) : 3000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
