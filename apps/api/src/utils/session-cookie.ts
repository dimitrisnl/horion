import type {Context as HonoContext} from "hono";
import {deleteCookie, getSignedCookie, setSignedCookie} from "hono/cookie";

import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_IN_SECONDS,
} from "~/config/constants";
import {envVars} from "~/config/env";
import {isProduction} from "~/config/runtime";

export function createSessionCookieHelper(context: HonoContext) {
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
