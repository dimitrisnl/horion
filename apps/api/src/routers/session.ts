import {SessionService} from "~/domain/session/service";
import {protectedProcedure} from "~/lib/orpc";

export const sessionRouter = {
  getAll: protectedProcedure.handler(async ({context}) => {
    const userId = context.session.user.id;

    const sessions = await SessionService.getAll({userId});

    return {
      sessions,
    };
  }),
};
