import {useRouteContext} from "@tanstack/react-router";

export const useCurrentMembership = () => {
  const {membership} = useRouteContext({from: "/_authed/$orgId"});

  return membership;
};
