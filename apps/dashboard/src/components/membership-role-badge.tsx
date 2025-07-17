import {Badge} from "@horionos/ui/badge";

type MembershipRole = "owner" | "admin" | "member";

export const MembershipRoleBadge = ({role}: {role: MembershipRole}) => {
  if (role === "owner") {
    return <Badge variant="outline">Owner</Badge>;
  }
  if (role === "admin") {
    return <Badge variant="outline">Admin</Badge>;
  }
  if (role === "member") {
    return <Badge variant="outline">Member</Badge>;
  }
  return null;
};
