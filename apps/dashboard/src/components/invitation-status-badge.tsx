import {Badge} from "@horionos/ui/badge";

export const InvitationStatusBadge = ({status}: {status: string}) => {
  if (status === "expired") {
    return <Badge variant="destructive">Expired</Badge>;
  }
  if (status === "pending") {
    return <Badge variant="outline">Pending</Badge>;
  }
  if (status === "declined") {
    return <Badge variant="destructive">Declined</Badge>;
  }

  return null;
};
