import {VERIFICATION_TOKEN_DURATION_IN_SECONDS} from "~/constants";
import {verificationRepo} from "~/domain/verification/repository";
import {generateToken} from "~/lib/token";

export const verificationService = {
  createVerificationToken: async ({email}: {email: string}) => {
    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_DURATION_IN_SECONDS * 1000,
    ); // 5 minutes

    const verification = await verificationRepo.create({
      email,
      token,
      expiresAt,
    });

    return verification;
  },
  getVerification: async ({token}: {token: string}) => {
    const verification = await verificationRepo.findByToken(token);

    return verification;
  },

  deleteVerification: async ({token}: {token: string}) => {
    await verificationRepo.deleteByToken(token);
  },
};
