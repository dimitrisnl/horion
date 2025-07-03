import clsx from "clsx";

export function Heading1({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h1">) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      {...props}
      className={clsx(className, "text-2xl font-bold tracking-tight")}
    />
  );
}

export const Heading2 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) => {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2
      {...props}
      className={clsx(className, "text-xl font-semibold tracking-tight")}
    />
  );
};

export const Heading3 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) => {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3
      {...props}
      className={clsx(className, "text-lg font-semibold tracking-tight")}
    />
  );
};

export const Heading4 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h4">) => {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h4
      {...props}
      className={clsx(className, "text-base font-semibold tracking-tight")}
    />
  );
};

export function Text({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <div
      data-slot="text"
      {...props}
      className={clsx(className, "text-muted-foreground text-sm/6")}
    />
  );
}

export function Strong({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"strong">) {
  return (
    <strong
      {...props}
      className={clsx(className, "text-foreground font-medium")}
    />
  );
}
