import {MapIcon} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";
import {Heading1, Text} from "@horionos/ui/text";

import {Link} from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <div className="flex min-h-svh flex-col items-center gap-6 p-6 px-10 pt-24">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <MapIcon className="size-4" />
          </div>
          <Heading1>Page not found</Heading1>
        </div>
        <Text>
          The page you are looking for does not exist or has been moved. Please
          check the URL or return to the homepage.
        </Text>
        <div>
          <Link to="/" className={buttonVariants({variant: "outline"})}>
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
