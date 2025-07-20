import {z} from "zod/v4";

import {
  createInvitationInputSchema,
  deleteInvitationInputSchema,
  getInvitationsInputSchema,
} from "~/models/invitation";
import {protectedProcedure, publicProcedure} from "~/orpc";
import {OrganizationService} from "~/services/organization-service";

export const invitationRouter = {
  check: publicProcedure
    .input(z.object({token: z.string()}))
    .handler(async ({input, context}) => {
      const {db} = context;
      const {token} = input;

      const {invitation, organization} =
        await OrganizationService.getInvitationByToken({db, token});

      return {
        organization: {name: organization.name},
        invitation: {role: invitation.role},
      };
    }),

  create: protectedProcedure
    .input(createInvitationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session, eventEmitter} = context;
      const {email, role, organizationId} = input;
      const userId = session.userId;

      const {invitation, organization, invitee} =
        await OrganizationService.createInvitation({
          db,
          organizationId,
          actorId: userId,
          role,
          email,
        });

      eventEmitter("invitation-created", {
        inviteeEmail: email,
        inviteeId: invitee?.id,
        organizationName: organization.name,
        invitationToken: invitation.token,
      });

      return {success: true};
    }),

  getAll: protectedProcedure
    .input(getInvitationsInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {organizationId} = input;
      const userId = session.userId;

      const invitations = await OrganizationService.getInvitations({
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

      await OrganizationService.deleteInvitation({
        db,
        invitationId,
        organizationId,
        actorId: userId,
      });

      return {success: true};
    }),
};
