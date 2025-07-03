import {createInvitation, deleteInvitation} from "./mutations";
import {
  findInvitationByEmailAndOrganizationId,
  findInvitationById,
  findInvitationByToken,
  findInvitationsByOrganizationId,
} from "./queries";

export const Invitation = {
  create: createInvitation,
  findById: findInvitationById,
  findByToken: findInvitationByToken,
  findByEmailAndOrganizationId: findInvitationByEmailAndOrganizationId,
  findManyByOrganizationId: findInvitationsByOrganizationId,
  delete: deleteInvitation,
};

export * from "./schema";
