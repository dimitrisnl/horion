import {useRouteContext} from "@tanstack/react-router";

export const useCurrentMembership = () => {
  const {membership} = useRouteContext({from: "/_protected/$orgId"});

  return membership;
};
