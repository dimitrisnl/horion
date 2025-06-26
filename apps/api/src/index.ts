import {Hono} from "hono";
import {cors} from "hono/cors";
import {logger} from "hono/logger";
import {secureHeaders} from "hono/secure-headers";

import {onError} from "@orpc/server";
import {RPCHandler} from "@orpc/server/fetch";
import {ResponseHeadersPlugin} from "@orpc/server/plugins";
import {z} from "zod/v4";

import {envVars} from "./config";
import {SessionService} from "./domain/session/service";
import {userService} from "./domain/user/service";
import {verificationService} from "./domain/verification/service";
import {createContext} from "./lib/context";
import {createCookieService} from "./lib/cookie-service";
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

// TODO: include a more restrictive error handler
const handler = new RPCHandler(appRouter, {
  clientInterceptors: [onError((error) => zodValidationInterceptor(error))],
  plugins: [new ResponseHeadersPlugin()],
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

app.get("/auth/verify", async (ctx) => {
  const queryObject = ctx.req.query();

  const validation = z.object({token: z.string()}).safeParse(queryObject);

  if (!validation.success) {
    return ctx.redirect(`${envVars.DASHBOARD_URL}/login/?error=invalid_token`);
  }

  const {token} = validation.data;

  const verification = await verificationService.getVerification({token});

  if (!verification) {
    return ctx.redirect(`${envVars.DASHBOARD_URL}/login/?error=invalid_token`);
  }

  if (verification.expiresAt < new Date()) {
    // TODO: maybe do this in a background job
    await verificationService.deleteVerification({token});

    return ctx.redirect(`${envVars.DASHBOARD_URL}/login/?error=expired_token`);
  }

  await verificationService.deleteVerification({token});
  let user = await userService.getUserByEmail({email: verification.value});

  // Create the user if they don't exist
  if (!user) {
    user = await userService.createUser({email: verification.value});

    if (!user) {
      return ctx.redirect(
        `${envVars.DASHBOARD_URL}/login/?error=failed_to_create_user`,
      );
    }
  }

  const session = await SessionService.createSession({userId: user.id});

  if (!session) {
    return ctx.redirect(
      `${envVars.DASHBOARD_URL}/login/?error=failed_to_create_session`,
    );
  }

  const sessionToken = session.token;

  const cookieService = createCookieService(ctx);
  await cookieService.createSessionCookie(sessionToken);

  return ctx.redirect(`${envVars.DASHBOARD_URL}`);
});

app.get("/", (ctx) => {
  return ctx.text("OK");
});

export default {
  port: envVars.PORT,
  // hostname: "0.0.0.0",
  fetch: app.fetch,
};
