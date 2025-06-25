import {Card} from "@horionos/ui/card";
import {Heading1, Text} from "@horionos/ui/text";

import {type ErrorComponentProps, Link} from "@tanstack/react-router";

// eslint-disable-next-line
export function DefaultCatchBoundary({error}: ErrorComponentProps) {
  return (
    <Card>
      <div className="grid w-full grid-cols-1 gap-6">
        <div>
          <Heading1 className="text-xl">Something went wrong</Heading1>
          <Text>An unexpected error occurred. Please try again.</Text>
        </div>
        <Text>
          Otherwise let&apos;s <Link to="/">go back</Link>
        </Text>
      </div>
    </Card>
  );
}
