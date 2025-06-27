import {protectedProcedure} from "~/app/orpc-procedures";
import {getUserMemberships} from "~/core/accounts/queries/get-user-memberships";

export const membershipRouter = {
  getAll: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const userId = session.userId;

    const memberships = await getUserMemberships({db})({userId});

    return {memberships};
  }),
};
