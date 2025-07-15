import {Badge} from "@horionos/ui/badge";

type InvitationRole = "member" | "admin";

export const InvitationRoleBadge = ({role}: {role: InvitationRole}) => {
  if (role === "admin") {
    return <Badge variant="tertiary">Admin</Badge>;
  }
  if (role === "member") {
    return <Badge variant="outline">Member</Badge>;
  }
  return null;
};
