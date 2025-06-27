import {authRouter} from "./auth";
import {membershipRouter} from "./membership";
import {organizationRouter} from "./organization";
import {sessionRouter} from "./session";
import {userRouter} from "./user";

export const appRouter = {
  user: userRouter,
  auth: authRouter,
  membership: membershipRouter,
  organization: organizationRouter,
  session: sessionRouter,
};

export type AppRouter = typeof appRouter;
