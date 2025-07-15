import {createMembership} from "./mutations";
import {
  findMembership,
  findMembershipsByOrganizationId,
  findMembershipsByUserId,
} from "./queries";

export const Membership = {
  create: createMembership,
  find: findMembership,
  findManyByUserId: findMembershipsByUserId,
  findManyByOrganizationId: findMembershipsByOrganizationId,
};

export * from "./schema";
