import {createInvitation, deleteInvitation} from "./mutations";
import {
  findInvitationByEmailAndOrganizationId,
  findInvitationById,
  findInvitationByToken,
  findInvitationsByEmail,
  findInvitationsByOrganizationId,
} from "./queries";

export const Invitation = {
  create: createInvitation,
  findById: findInvitationById,
  findByToken: findInvitationByToken,
  findManyByEmail: findInvitationsByEmail,
  findByEmailAndOrganizationId: findInvitationByEmailAndOrganizationId,
  findManyByOrganizationId: findInvitationsByOrganizationId,
  delete: deleteInvitation,
};

export * from "./schema";
