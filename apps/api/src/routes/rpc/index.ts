import {accountRouter} from "./account";
import {authRouter} from "./auth";
import {invitationRouter} from "./invitation";
import {organizationRouter} from "./organization";

export const rpcRouter = {
  account: accountRouter,
  auth: authRouter,
  organization: organizationRouter,
  invitation: invitationRouter,
};

export type RPCRouter = typeof rpcRouter;
