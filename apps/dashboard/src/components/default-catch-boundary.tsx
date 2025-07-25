import {buttonVariants} from "@horionos/ui/button";
import {Heading1, Text} from "@horionos/ui/text";

import {type ErrorComponentProps, Link} from "@tanstack/react-router";

export function DefaultCatchBoundary({error}: ErrorComponentProps) {
  console.log("Error caught in DefaultCatchBoundary:", error);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <div>
        <Heading1 className="text-xl">Something went wrong</Heading1>
        <Text className="max-w-lg text-balance">
          An unexpected error occurred
        </Text>
      </div>
      <Text>
        <Link
          to="/"
          className={buttonVariants({variant: "default", size: "sm"})}
        >
          Back to Home
        </Link>
      </Text>
    </div>
  );
}
