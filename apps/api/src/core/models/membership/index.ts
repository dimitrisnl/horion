import {createMembership} from "./mutations";
import {findMembership, findMembershipsByUserId} from "./queries";

export const Membership = {
  create: createMembership,
  find: findMembership,
  findManyByUserId: findMembershipsByUserId,
};

export * from "./schema";
