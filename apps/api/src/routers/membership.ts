import {membershipService} from "~/domain/membership/service";
import {protectedProcedure} from "~/lib/orpc";

export const membershipRouter = {
  getAll: protectedProcedure.handler(async ({context}) => {
    const userId = context.session.user.id;

    const memberships = await membershipService.getAllMemberships({userId});

    return {memberships};
  }),
};
