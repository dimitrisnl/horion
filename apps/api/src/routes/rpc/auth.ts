import {z} from "zod/v4";

import {emailSchema} from "~/models/email";
import {Verification} from "~/models/verification";
import {publicProcedure} from "~/orpc";
import {AccountService} from "~/services/account-service";
import {getSessionFingerprint} from "~/utils/session-fingerprint";

export const authRouter = {
  sendMagicLink: publicProcedure
    .input(z.object({email: emailSchema}))
    .handler(async ({input, context}) => {
      const {email} = input;
      const {db, eventEmitter} = context;

      const verification = await Verification.create({db, value: email});

      eventEmitter("magic-link-requested", {
        email,
        identifier: verification.identifier,
      });

      return {success: true};
    }),
  verifyMagicLink: publicProcedure
    .input(z.object({token: z.string()}))
    .handler(async ({input, context}) => {
      const {token} = input;
      const {db, cookieHelper, headers, eventEmitter} = context;

      const incomingHeaders = Object.fromEntries(headers.entries());
      const fingerprintMetadata = await getSessionFingerprint(incomingHeaders);

      const {isRegistration, session, user} =
        await AccountService.validateTokenAndCreateUser({
          db,
          token,
          fingerprintMetadata,
        });

      const sessionToken = session.token;
      await cookieHelper.createSessionCookie(sessionToken);

      if (isRegistration) {
        eventEmitter("user-created", {email: user.email, id: user.id});
      }

      return {success: true};
    }),
};
