import {z} from "zod/v4";

import {protectedProcedure} from "~/app/orpc";
import {OrganizationContext} from "~/core/contexts/organization";
import {
  createOrganizationInputSchema,
  getOrganizationInputSchema,
  updateOrganizationInputSchema,
} from "~/core/models/organization";

export const organizationRouter = {
  get: protectedProcedure
    .input(getOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const userId = session.userId;

      const {id: organizationId} = input;

      const organization = await OrganizationContext.getOrganization({
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
        await OrganizationContext.createOrganization({
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

      const organization = await OrganizationContext.updateOrganization({
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

      const memberships = await OrganizationContext.getMemberships({
        db,
        organizationId,
        actorId: userId,
      });

      return {memberships};
    }),
};
