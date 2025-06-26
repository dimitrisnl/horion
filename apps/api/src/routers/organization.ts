import {ORPCError} from "@orpc/client";

import {
  createOrgSchema,
  getOrgSchema,
  updateOrgSchema,
} from "~/domain/organization/schema";
import {organizationService} from "~/domain/organization/service";
import {protectedProcedure} from "~/lib/orpc";

export const organizationRouter = {
  get: protectedProcedure
    .input(getOrgSchema)
    .handler(async ({context, input}) => {
      const {organizationId} = input;
      const userId = context.session.userId;

      const organization = await organizationService.getOrganization({
        organizationId,
        userId,
      });

      if (!organization) {
        throw new ORPCError("Organization not found");
      }

      return {organization};
    }),

  create: protectedProcedure
    .input(createOrgSchema)
    .handler(async ({context, input}) => {
      const {name} = input;
      const userId = context.session.userId;

      const organization = await organizationService.createOrganization({
        name,
        userId,
      });

      if (!organization) {
        throw new ORPCError("Failed to create organization");
      }

      return {
        organization,
        message: "Organization created successfully",
      };
    }),

  update: protectedProcedure
    .input(updateOrgSchema)
    .handler(async ({context, input}) => {
      const {organizationId, name} = input;

      const userId = context.session.userId;

      const organization = await organizationService.updateOrganization({
        organizationId,
        name,
        userId,
      });

      if (!organization) {
        throw new ORPCError("Failed to update organization");
      }

      return {
        organization,
        message: "Organization updated successfully",
      };
    }),
};
