import type {Context as HonoContext} from "hono";
import {deleteCookie, getSignedCookie, setSignedCookie} from "hono/cookie";

import {envVars} from "~/config";
import {SESSION_COOKIE_NAME, SESSION_DURATION_IN_SECONDS} from "~/constants";
import {isProduction} from "~/utils/environment";

export function createCookieService(context: HonoContext) {
  return {
    getSessionToken: () =>
      getSignedCookie(
        context,
        envVars.SECRET,
        SESSION_COOKIE_NAME,
        isProduction() ? "secure" : undefined,
      ),

    createSessionCookie: (token: string) => {
      return setSignedCookie(
        context,
        SESSION_COOKIE_NAME,
        token,
        envVars.SECRET,
        {
          httpOnly: true,
          secure: isProduction(),
          sameSite: "lax",
          path: "/",
          maxAge: SESSION_DURATION_IN_SECONDS, // 30 days
          domain: isProduction() ? undefined : "localhost",
        },
      );
    },

    deleteSessionCookie: () => {
      deleteCookie(context, SESSION_COOKIE_NAME);
    },
  };
}
