import {z} from "zod/v4";

import {envVars} from "~/config";
import {auth} from "~/lib/auth";
import {publicProcedure} from "~/lib/orpc";

const FRONT_END_URL = envVars.FRONT_END_URL;

export const authRouter = {
  getSession: publicProcedure.handler(({context}) => {
    const {session} = context;
    return {
      user: session?.user,
      session: {
        token: session?.session.token,
        expires: session?.session.expiresAt,
      },
    };
  }),

  sendMagicLink: publicProcedure
    .input(z.object({email: z.email()}))
    .handler(async ({input, context}) => {
      const {email} = input;

      const {status: ok} = await auth.api
        .signInMagicLink({
          body: {
            email,
            callbackURL: FRONT_END_URL,
          },
          headers: context.headers,
        })
        .catch(() => {
          throw new Error("Failed to send magic link");
        });

      if (!ok) {
        throw new Error("Failed to send magic link");
      }

      return {message: "Magic link sent successfully"};
    }),

  signOut: publicProcedure.handler(async ({context}) => {
    const {success: ok} = await auth.api
      .signOut({
        headers: context.headers,
      })
      .catch(() => {
        throw new Error("Failed to sign out");
      });

    if (!ok) {
      throw new Error("Failed to sign out");
    }

    return {message: "Signed out successfully"};
  }),
};
