import {ORPCError} from "@orpc/client";
import {z} from "zod/v4";

import {protectedProcedure, publicProcedure} from "~/app/orpc";
import {envVars} from "~/config";
import {createVerificationToken} from "~/core/accounts/actions/create-verification-token";
import {deleteSession} from "~/core/accounts/actions/delete-session";
import {sendMagicLinkEmail} from "~/services/email";

const getMagicLinkUrl = (token: string) => {
  return `${envVars.BASE_URL}/auth/verify?token=${token}`;
};

export const authRouter = {
  getActiveSession: publicProcedure.handler(({context}) => {
    const {session} = context;

    if (!session) {
      return {
        session: null,
      };
    }

    return {
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    };
  }),

  sendMagicLink: publicProcedure
    .input(z.object({email: z.email()}))
    .handler(async ({input}) => {
      const {email} = input;

      const verification = await createVerificationToken({email});
      const url = getMagicLinkUrl(verification.identifier);

      return sendMagicLinkEmail({to: email, url})
        .then(() => ({message: "Magic link sent successfully"}))
        .catch(() => {
          throw new ORPCError("FAILED_TO_SEND_MAGIC_LINK_EMAIL");
        });
    }),

  signOut: protectedProcedure.handler(async ({context}) => {
    const {session, cookieService} = context;

    await deleteSession({token: session.token});
    cookieService.deleteSessionCookie();

    return {message: "Signed out successfully"};
  }),
};
