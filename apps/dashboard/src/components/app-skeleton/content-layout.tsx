import {Heading1, Text} from "@horionos/ui/text";

export const ContentLayout = ({
  title,
  children,
  actions,
  subtitle,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  subtitle?: string;
}) => {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto mt-12 mb-16 flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 border-b pb-8">
            <div className="space-y-1">
              <Heading1>{title}</Heading1>
              {subtitle && <Text>{subtitle}</Text>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
};
