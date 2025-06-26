import {membershipRepo} from "~/domain/membership/repository";

export const membershipService = {
  getAllMemberships: async ({userId}: {userId: string}) => {
    const memberships = await membershipRepo.findAll({userId});

    return memberships;
  },

  getMembership: async ({
    organizationId,
    userId,
  }: {
    organizationId: string;
    userId: string;
  }) => {
    const membership = await membershipRepo.find({organizationId, userId});

    return membership;
  },
};
