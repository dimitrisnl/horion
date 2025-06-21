import {ORPCError} from "@orpc/client";

import {membershipService} from "~/domain/membership/service";

import {organizationRepo} from "./repository";

export const organizationService = {
  async getOrganization({
    organizationId,
    userId,
  }: {
    organizationId: string;
    userId: string;
  }) {
    const membership = await membershipService.getMembership({
      organizationId,
      userId,
    });

    if (!membership) {
      throw new ORPCError("Organization not found");
    }

    const organization = await organizationRepo.findByIdAndUserId({
      organizationId,
      userId,
    });

    return organization;
  },

  async createOrganization({name, userId}: {name: string; userId: string}) {
    const organization = await organizationRepo.create({
      name,
      userId,
    });

    return organization;
  },

  async updateOrganization({
    organizationId,
    name,
    userId,
  }: {
    organizationId: string;
    name: string;
    userId: string;
  }) {
    const membership = await membershipService.getMembership({
      organizationId,
      userId,
    });

    if (!membership) {
      throw new ORPCError("Organization not found");
    }

    const organization = await organizationRepo.update({
      organizationId,
      name,
    });

    return organization;
  },
};
