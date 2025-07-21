import {
  createInvitation,
  declineInvitation,
  deleteInvitation,
} from "./mutations";
import {
  findInvitationByEmailAndOrganizationId,
  findInvitationById,
  findInvitationByToken,
  findInvitationsByEmail,
  findInvitationsByOrganizationId,
} from "./queries";

export const Invitation = {
  create: createInvitation,
  decline: declineInvitation,
  delete: deleteInvitation,
  findById: findInvitationById,
  findByToken: findInvitationByToken,
  findManyByEmail: findInvitationsByEmail,
  findByEmailAndOrganizationId: findInvitationByEmailAndOrganizationId,
  findManyByOrganizationId: findInvitationsByOrganizationId,
};

export * from "./schema";
