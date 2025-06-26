import {LoaderCircleIcon} from "@horionos/icons";
import {Alert, AlertDescription, AlertTitle} from "@horionos/ui/alert";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {Separator} from "@horionos/ui/separator";
import {toast} from "@horionos/ui/sonner";

import {useForm} from "@tanstack/react-form";
import {useMutation} from "@tanstack/react-query";
import {createFileRoute, redirect, useNavigate} from "@tanstack/react-router";

import {z} from "zod/v4";

import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

const errorToMessage = {
  invalid_token: {
    title: "The magic link is invalid or has expired",
    description:
      "Please request a new magic link to log in. If you continue to experience issues, please contact support",
  },
  expired_token: {
    title: "The magic link has expired",
    description: "Please request a new one to log in",
  },
  failed_to_create_user: {
    title: "An error occurred while creating your account",
    description:
      "Please try again later or contact support if the issue persists",
  },
  failed_to_create_session: {
    title: "An error occurred while logging you in",
    description:
      "Please try again later or contact support if the issue persists",
  },
  default: {
    title: "An unexpected error occurred",
    description:
      "Please try again later or contact support if the issue persists",
  },
} as Record<string, {title: string; description: string}>;

const ErrorAlert = ({error}: {error: string}) => {
  const message = errorToMessage[error] || errorToMessage.default;
  return (
    <div>
      <Alert variant="destructive">
        <AlertTitle>{message.title}</AlertTitle>
        <AlertDescription className="text-balance">
          {message.description}
        </AlertDescription>
      </Alert>
      <Separator className="my-8" />
    </div>
  );
};

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
  validateSearch: z.object({
    error: z.string().optional(),
  }),
  beforeLoad: ({context}) => {
    if (context.userId) {
      throw redirect({to: "/"});
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate({from: "/login"});
  const {error} = Route.useSearch();

  const sendMagicLinkMutation = useMutation(
    orpc.auth.sendMagicLink.mutationOptions({
      onSuccess: () => {
        navigate({to: "/magic-link-sent"});
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send magic link");
      },
    }),
  );

  const form = useForm({
    defaultValues: {email: ""},
    validators: {
      onSubmitAsync: ({value: {email}}) => {
        return withValidationErrors(sendMagicLinkMutation.mutateAsync({email}));
      },
      onSubmit: z.object({email: z.email("Invalid email address")}),
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {error ? <ErrorAlert error={error} /> : null}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-muted-foreground text-sm text-balance">
          New here or coming back? Just enter your email to get started.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-6">
          <form.Field name="email">
            {(field) => (
              <div className="grid gap-3">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  placeholder="email@example.com"
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  required
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : null}
                {state.isSubmitting ? "Sending..." : "Send me a magic link"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
