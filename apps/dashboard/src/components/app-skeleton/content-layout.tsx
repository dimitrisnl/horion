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
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mt-12 mb-12 flex w-full flex-wrap items-center justify-between gap-2 border-b pb-4">
            <div className="space-y-0.5">
              <Heading1>{title}</Heading1>
              {subtitle && <Text>{subtitle}</Text>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
