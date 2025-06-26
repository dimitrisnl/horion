import type {Context as HonoContext} from "hono";
import {deleteCookie, getSignedCookie, setSignedCookie} from "hono/cookie";

import {envVars} from "~/config";
import {SESSION_COOKIE_NAME, SESSION_DURATION_IN_SECONDS} from "~/constants";

export function createCookieService(context: HonoContext) {
  return {
    getSessionToken: () =>
      getSignedCookie(
        context,
        envVars.SECRET,
        SESSION_COOKIE_NAME,
        envVars.BUN_ENVIRONMENT === "production" ? "secure" : undefined,
      ),

    createSessionCookie: (token: string) => {
      return setSignedCookie(
        context,
        SESSION_COOKIE_NAME,
        token,
        envVars.SECRET,
        {
          httpOnly: true,
          secure: envVars.BUN_ENVIRONMENT === "production",
          sameSite: "lax",
          path: "/",
          maxAge: SESSION_DURATION_IN_SECONDS, // 30 days
          //  TODO: should I add this?
          // "domain"
        },
      );
    },

    deleteSessionCookie: () => {
      deleteCookie(context, SESSION_COOKIE_NAME);
    },
  };
}
