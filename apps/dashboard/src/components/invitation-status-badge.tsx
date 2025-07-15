import {Badge} from "@horionos/ui/badge";

export const InvitationStatusBadge = ({status}: {status: string}) => {
  if (status === "pending") {
    return <Badge variant="outline">Pending</Badge>;
  }
  if (status === "expired") {
    return <Badge variant="outline">Expired</Badge>;
  }

  return null;
};
