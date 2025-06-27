import {protectedProcedure} from "~/app/orpc-procedures";
import {getUserMemberships} from "~/core/accounts/queries/get-user-memberships";

export const membershipRouter = {
  getAll: protectedProcedure.handler(async ({context}) => {
    const userId = context.session.userId;

    const memberships = await getUserMemberships({userId});

    return {memberships};
  }),
};
