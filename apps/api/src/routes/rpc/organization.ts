import {ORPCError} from "@orpc/client";

import {protectedProcedure} from "~/app/orpc";
import {createOrganization} from "~/core/accounts/actions/create-organization";
import {updateOrganization} from "~/core/accounts/actions/update-organization";
import {getOrganization} from "~/core/accounts/queries/get-organization";
import {
  createOrganizationSchema,
  getOrganizationSchema,
  updateOrganizationSchema,
} from "~/core/accounts/schemas/organization";

export const organizationRouter = {
  get: protectedProcedure
    .input(getOrganizationSchema)
    .handler(async ({context, input}) => {
      const {organizationId} = input;
      const userId = context.session.userId;

      const organization = await getOrganization({
        organizationId,
        userId,
      });

      if (!organization) {
        throw new ORPCError("Organization not found");
      }

      return {organization};
    }),

  create: protectedProcedure
    .input(createOrganizationSchema)
    .handler(async ({context, input}) => {
      const {name} = input;
      const userId = context.session.userId;

      const organization = await createOrganization({
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
    .input(updateOrganizationSchema)
    .handler(async ({context, input}) => {
      const {organizationId, name} = input;

      const userId = context.session.userId;

      const organization = await updateOrganization({
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
