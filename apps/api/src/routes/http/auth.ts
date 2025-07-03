import {db} from "@horionos/db";

import type {Context as HonoContext} from "hono";

import {z} from "zod/v4";

import {envVars} from "~/config";
import {AccountContext} from "~/core/contexts/account";
import {
  InvalidVerificationTokenError,
  VerificationExpiredError,
} from "~/core/errors/error-types";
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

  try {
    const result = await AccountContext.validateTokenAndCreateUser({
      db,
      token,
      fingerprintMetadata,
    });

    const sessionToken = result.session.token;
    const cookieService = createCookieService(ctx);
    await cookieService.createSessionCookie(sessionToken);

    return ctx.redirect(redirectTo({type: "success"}));
  } catch (error) {
    if (error instanceof InvalidVerificationTokenError) {
      return ctx.redirect(redirectTo({type: "error", error: "invalid_token"}));
    } else if (error instanceof VerificationExpiredError) {
      return ctx.redirect(redirectTo({type: "error", error: "expired_token"}));
    }

    return ctx.redirect(redirectTo({type: "error", error: "unexpected_error"}));
  }
};
