import {useEffect} from "react";

import {ArrowLeftIcon, TriangleAlertIcon} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";
import {Heading1, Text} from "@horionos/ui/text";

import {useMutation} from "@tanstack/react-query";
import {createFileRoute, Link, useNavigate} from "@tanstack/react-router";

import {ORPCError} from "@orpc/client";
import {z} from "zod/v4";

import {Loader} from "~/components/loader";
import {orpc} from "~/utils/orpc";
export const Route = createFileRoute("/_guest/verify-token")({
  component: RouteComponent,
  validateSearch: z.object({token: z.string()}),
});

const errorToMessage = {
  INVALID_VERIFICATION_TOKEN: {
    title: "The magic link is invalid or has expired",
    description:
      "Please request a new magic link to log in. If you continue to experience issues, please contact support",
  },
  VERIFICATION_EXPIRED: {
    title: "The magic link has expired",
    description: "Please request a new one to log in",
  },
  default: {
    title: "An unexpected error occurred",
    description:
      "Please try again later or contact support if the issue persists",
  },
} as Record<string, {title: string; description: string}>;

const normalizeError = (error: unknown) => {
  if (error instanceof ORPCError) {
    return {
      title: errorToMessage[error.code]?.title || errorToMessage.default.title,
      description:
        errorToMessage[error.code]?.description ||
        errorToMessage.default.description,
    };
  } else {
    return {
      title: errorToMessage.default.title,
      description: errorToMessage.default.description,
    };
  }
};

function RouteComponent() {
  const navigate = useNavigate();
  const {token} = Route.useSearch();

  const {mutate, error} = useMutation(
    orpc.auth.verifyMagicLink.mutationOptions({
      onSuccess: () => {
        navigate({to: "/", reloadDocument: true});
      },
    }),
  );

  useEffect(() => {
    mutate({token});
  }, [mutate, token]);

  if (error) {
    const errorMessage = normalizeError(error);
    return (
      <div className="space-y-4">
        <div className="bg-primary inline-flex items-center rounded-md p-1.5">
          <TriangleAlertIcon className="text-primary-foreground size-5" />
        </div>
        <div className="flex items-center gap-2">
          <Heading1>{errorMessage.title}</Heading1>
        </div>
        <Text>{errorMessage.description}</Text>
        <Link to="/login" className={buttonVariants({variant: "outline"})}>
          <ArrowLeftIcon />
          Go back to login
        </Link>
      </div>
    );
  }

  return <Loader />;
}
