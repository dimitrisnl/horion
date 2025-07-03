import {z} from "zod/v4";

import {protectedProcedure, publicProcedure} from "~/app/orpc-procedures";
import {envVars} from "~/config";
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
  check: publicProcedure
    .input(z.object({token: z.string()}))
    .handler(async ({input, context}) => {
      const {db} = context;
      const {token} = input;

      const {invitation, organization} =
        await OrganizationContext.getInvitationByToken({db, token});

      return {
        organization: {
          name: organization.name,
        },
        invitation: {
          role: invitation.role,
        },
      };
    }),

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
          url: `${envVars.DASHBOARD_URL}/account/invitations`,
          organization: {name: organization.name},
        })
          .then(() => ({invitation}))
          .catch(() => {
            throw errors.FAILED_TO_SEND_INVITATION_EMAIL();
          });
      } else {
        sendInvitationWithoutAccountEmail({
          to: email,
          url: `${envVars.DASHBOARD_URL}/accept-invitation?token=${invitation.token}`,
          organization: {name: organization.name},
        })
          .then(() => ({invitation}))
          .catch(() => {
            throw errors.FAILED_TO_SEND_INVITATION_EMAIL();
          });
      }

      return {success: true};
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
