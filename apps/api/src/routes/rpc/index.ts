import {authRouter} from "./auth";
import {invitationRouter} from "./invitation";
import {membershipRouter} from "./membership";
import {organizationRouter} from "./organization";
import {sessionRouter} from "./session";
import {userRouter} from "./user";

export const rpcRouter = {
  user: userRouter,
  auth: authRouter,
  membership: membershipRouter,
  organization: organizationRouter,
  session: sessionRouter,
  invitation: invitationRouter,
};

export type RPCRouter = typeof rpcRouter;
