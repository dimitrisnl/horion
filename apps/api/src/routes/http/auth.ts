import type {Context as HonoContext} from "hono";

import {z} from "zod/v4";

import {envVars} from "~/config";
import {verifyMagicLink} from "~/core/accounts/workflows/verify-magic-link";
import {createCookieService} from "~/services/cookies";
import {getSessionFingerprint} from "~/utils/fingerprint";

export const redirectTo = (
  props: {type: "error"; error: string} | {type: "success"},
) => {
  if (props.type === "error") {
    return `${envVars.DASHBOARD_URL}/login/?error=${props.error}`;
  }
  return envVars.DASHBOARD_URL;
};

export const verifyMagicLinkRoute = async (ctx: HonoContext) => {
  const queryObject = ctx.req.query();
  const headers = ctx.req.raw.headers;

  const validation = z.object({token: z.string()}).safeParse(queryObject);

  if (!validation.success) {
    return ctx.redirect(redirectTo({type: "error", error: "invalid_token"}));
  }

  const incomingHeaders = Object.fromEntries(headers.entries());
  const fingerprintMetadata = await getSessionFingerprint(incomingHeaders);
  const {token} = validation.data;

  const result = await verifyMagicLink({token, fingerprintMetadata});

  if (result.type === "error") {
    return ctx.redirect(redirectTo({type: "error", error: result.error}));
  }

  const sessionToken = result.session.token;
  const cookieService = createCookieService(ctx);
  await cookieService.createSessionCookie(sessionToken);

  return ctx.redirect(redirectTo({type: "success"}));
};
