import {z} from "zod/v4";

import {
  createOrganizationInputSchema,
  getOrganizationInputSchema,
  updateOrganizationInputSchema,
} from "~/models/organization";
import {protectedProcedure} from "~/orpc";
import {OrganizationService} from "~/services/organization-service";

export const organizationRouter = {
  get: protectedProcedure
    .input(getOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const userId = session.userId;

      const {id: organizationId} = input;

      const organization = await OrganizationService.getOrganization({
        db,
        organizationId,
        actorId: userId,
      });

      return {organization};
    }),

  create: protectedProcedure
    .input(createOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {name} = input;
      const userId = session.userId;

      const {organization, membership} =
        await OrganizationService.createOrganization({
          db,
          name,
          actorId: userId,
        });

      return {organization, membership};
    }),

  update: protectedProcedure
    .input(updateOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {id: organizationId, name} = input;
      const userId = session.userId;

      const organization = await OrganizationService.updateOrganization({
        db,
        organizationId,
        name,
        actorId: userId,
      });

      return {
        organization,
      };
    }),

  getMemberships: protectedProcedure
    .input(z.object({organizationId: z.string()}))
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const userId = session.userId;
      const {organizationId} = input;

      const memberships = await OrganizationService.getMemberships({
        db,
        organizationId,
        actorId: userId,
      });

      return {memberships};
    }),
};
