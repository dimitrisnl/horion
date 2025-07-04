import type {Database} from "@horionos/db";

import {getSessionFingerprint} from "~/utils/fingerprint";

import {createSession} from "../actions/create-session";
import {createSessionMetadata} from "../actions/create-session-metadata";
import {createUser} from "../actions/create-user";
import {getUserByEmail} from "../queries/get-user-by-email";
import {getVerificationToken} from "../queries/get-verification-token";

type SessionFingerprintMetadata = Awaited<
  ReturnType<typeof getSessionFingerprint>
>;

interface VerifyMagicLinkArgs {
  token: string;
  fingerprintMetadata: SessionFingerprintMetadata;
}

export const verifyMagicLink = ({db}: {db: Database}) => {
  return async ({token, fingerprintMetadata}: VerifyMagicLinkArgs) => {
    const verificationToken = await getVerificationToken({db})({token});

    if (!verificationToken) {
      return {type: "error", error: "invalid_token"} as const;
    }

    if (verificationToken.expiresAt < new Date()) {
      return {type: "error", error: "expired_token"} as const;
    }

    let user = await getUserByEmail({db})({email: verificationToken.value});

    if (!user) {
      user = await createUser({db})({email: verificationToken.value});
      console.log(user);

      if (!user) {
        return {type: "error", error: "failed_to_create_user"} as const;
      }
    }

    const session = await createSession({db})({userId: user.id});

    if (!session) {
      return {type: "error", error: "failed_to_create_session"} as const;
    }

    try {
      await createSessionMetadata({db})({
        sessionId: session.id,
        ...fingerprintMetadata,
      });
    } catch (error) {
      // We don't care if this fails, we just log it
      console.error("Failed to create session metadata:", error);
    }

    return {type: "success", session} as const;
  };
};
