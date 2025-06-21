import {useParams} from "@tanstack/react-router";

export const useOrgId = () => {
  const {orgId} = useParams({strict: false});

  if (!orgId) {
    throw new Error("Organization ID is not defined");
  }

  return orgId;
};
