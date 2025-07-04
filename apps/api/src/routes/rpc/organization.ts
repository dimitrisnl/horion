import {ORPCError} from "@orpc/client";

import {protectedProcedure} from "~/app/orpc-procedures";
import {createOrganization} from "~/core/accounts/actions/create-organization";
import {updateOrganization} from "~/core/accounts/actions/update-organization";
import {getOrganization} from "~/core/accounts/queries/get-organization";
import {
  createOrganizationInputSchema,
  getOrganizationInputSchema,
  updateOrganizationInputSchema,
} from "~/core/accounts/schemas/organization";

export const organizationRouter = {
  get: protectedProcedure
    .input(getOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const userId = session.userId;
      const {id: organizationId} = input;

      const organization = await getOrganization({db})({
        organizationId,
        userId,
      });

      if (!organization) {
        throw new ORPCError("Organization not found");
      }

      return {organization};
    }),

  create: protectedProcedure
    .input(createOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {name} = input;
      const userId = session.userId;

      const organization = await createOrganization({db})({
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
    .input(updateOrganizationInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const {id: organizationId, name} = input;
      const userId = session.userId;

      const organization = await updateOrganization({db})({
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
