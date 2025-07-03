import {protectedProcedure} from "~/app/orpc-procedures";
import {OrganizationContext} from "~/core/contexts/organization";
import {
  createInvitationInputSchema,
  deleteInvitationInputSchema,
  getInvitationsInputSchema,
} from "~/core/models/invitation";
import {
  sendInvitationWithAccountEmail,
  sendInvitationWithoutAccountEmail,
} from "~/services/email/send-invitation-link";

export const invitationRouter = {
  create: protectedProcedure
    .input(createInvitationInputSchema)
    .handler(async ({context, input, errors}) => {
      const {db, session} = context;
      const {email, role, organizationId} = input;
      const userId = session.userId;

      const {invitation, organization, invitee} =
        await OrganizationContext.createInvitation({
          db,
          organizationId,
          actorId: userId,
          role,
          email,
        });

      if (invitee) {
        return sendInvitationWithAccountEmail({
          to: email,
          url: "some-url-to-accept-invitation", // TODO: Replace with actual URL. Probably to settings page
          organization: {name: organization.name},
        })
          .then(() => ({invitation}))
          .catch(() => {
            throw errors.FAILED_TO_SEND_INVITATION_EMAIL();
          });
      } else {
        sendInvitationWithoutAccountEmail({
          to: email,
          url: "some-url-to-accept-invitation", // TODO: Replace with actual URL. Probably to `accept-invitation` with similar flow to magic link
          organization: {name: organization.name},
        })
          .then(() => ({invitation}))
          .catch(() => {
            throw errors.FAILED_TO_SEND_INVITATION_EMAIL();
          });
      }

      return {invitation};
    }),

  getAll: protectedProcedure
    .input(getInvitationsInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {organizationId} = input;
      const userId = session.userId;

      const invitations = await OrganizationContext.getInvitations({
        db,
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

      await OrganizationContext.deleteInvitation({
        db,
        invitationId,
        organizationId,
        actorId: userId,
      });

      return {success: true};
    }),
};
