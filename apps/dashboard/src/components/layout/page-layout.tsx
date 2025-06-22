import {Separator} from "@horionos/ui/separator";

import {SiteHeader} from "./site-header";

export const PageLayout = ({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <>
      <SiteHeader title={title} actions={actions} />
      <Separator className="mb-4" />

      <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
    </>
  );
};
