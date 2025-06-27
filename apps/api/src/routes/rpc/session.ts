import {protectedProcedure} from "~/app/orpc";
import {getSessions} from "~/core/accounts/queries/get-sessions";

export const sessionRouter = {
  getAll: protectedProcedure.handler(async ({context}) => {
    const userId = context.session.userId;

    const sessions = await getSessions({userId});

    return {
      sessions,
    };
  }),
};
