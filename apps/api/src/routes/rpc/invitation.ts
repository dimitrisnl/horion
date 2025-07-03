import {protectedProcedure} from "~/app/orpc-procedures";
import {createInvitation} from "~/core/accounts/actions/create-invitation";
import {deleteInvitation} from "~/core/accounts/actions/delete-invitation";
import {getInvitations} from "~/core/accounts/queries/get-invitations";
import {
  createInvitationInputSchema,
  deleteInvitationInputSchema,
  getInvitationsInputSchema,
} from "~/core/accounts/schemas/invitation";

export const invitationRouter = {
  create: protectedProcedure
    .input(createInvitationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {email, role, organizationId} = input;
      const userId = session.userId;

      const {invitation} = await createInvitation({db})({
        userId,
        email,
        organizationId,
        role,
      });

      return {invitation, message: "Invitation created successfully"};
    }),

  getAll: protectedProcedure
    .input(getInvitationsInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {organizationId} = input;
      const userId = session.userId;

      const invitations = await getInvitations({db})({
        organizationId,
        userId,
      });

      return {invitations};
    }),

  delete: protectedProcedure
    .input(deleteInvitationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {id: invitationId, organizationId} = input;
      const userId = session.userId;

      await deleteInvitation({db})({
        invitationId,
        userId,
        organizationId,
      });

      return {message: "Invitation deleted successfully"};
    }),
};
