import {createOrganization, updateOrganizationName} from "./mutations";
import {findOrganization} from "./queries";

export const Organization = {
  create: createOrganization,
  updateName: updateOrganizationName,
  findById: findOrganization,
  findByEmail: findOrganization,
};

export * from "./schema";
