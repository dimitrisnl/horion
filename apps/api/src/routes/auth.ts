import type {Context as HonoContext} from "hono";

import {ORPCError} from "@orpc/client";
import {z} from "zod/v4";

import {protectedProcedure, publicProcedure} from "~/app/orpc";
import {envVars} from "~/config";
import {createVerificationToken} from "~/core/accounts/actions/create-verification-token";
import {deleteSession} from "~/core/accounts/actions/delete-session";
import {verifyMagicLink} from "~/core/accounts/workflows/verify-magic-link";
import {createCookieService} from "~/services/cookies";
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

export const verifyMagicLinkRoute = async (ctx: HonoContext) => {
  const queryObject = ctx.req.query();
  const headers = ctx.req.raw.headers;

  const validation = z.object({token: z.string()}).safeParse(queryObject);

  if (!validation.success) {
    return ctx.redirect(`${envVars.DASHBOARD_URL}/login/?error=invalid_token`);
  }

  // @ts-expect-error Types are messy
  const fingerprintMetadata = await getSessionFingerprint(headers);

  const {token} = validation.data;

  const result = await verifyMagicLink({
    token,
    fingerprintMetadata,
  });

  if (result.type === "error") {
    return ctx.redirect(
      `${envVars.DASHBOARD_URL}/login/?error=${result.error}`,
    );
  }

  const {session} = result;
  const sessionToken = session.token;

  const cookieService = createCookieService(ctx);
  await cookieService.createSessionCookie(sessionToken);

  return ctx.redirect(`${envVars.DASHBOARD_URL}`);
};
