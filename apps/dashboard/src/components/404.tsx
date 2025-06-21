import {MapIcon} from "@horion/icons";
import {buttonVariants} from "@horion/ui/button";

import {Link} from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <MapIcon className="size-4" />
          </div>
          Page not found
        </div>
        <p className="text-muted-foreground text-center text-sm">
          The page you are looking for does not exist or has been moved. Please
          check the URL or return to the homepage.
        </p>
        <div className="flex justify-center">
          <Link to="/" className={buttonVariants({variant: "outline"})}>
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
