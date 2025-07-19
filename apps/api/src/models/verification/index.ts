import {createVerification, deleteVerificationByIdentifier} from "./mutations";
import {findVerificationByIdentifier} from "./queries";

export const Verification = {
  create: createVerification,
  deleteByIdentifier: deleteVerificationByIdentifier,
  findByIdentifier: findVerificationByIdentifier,
};

export * from "./schema";
