import {useState} from "react";

import {LoaderCircleIcon, MailCheckIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {toast} from "@horionos/ui/sonner";
import {Heading1, Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {useMutation} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {z} from "zod/v4";

import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/_guest/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const sendMagicLinkMutation = useMutation(
    orpc.auth.sendMagicLink.mutationOptions({
      onSuccess: () => {
        setShowSuccessMessage(true);
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

  if (showSuccessMessage) {
    return <MagicLinkSentMessage />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Heading1>Welcome</Heading1>
        <div>
          <Text>We&apos;ll send you an email with a magic link to log in.</Text>
          <Text>
            If you don&apos;t have an account, don&apos;t worry! We will create
            one for you.
          </Text>
        </div>
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
                size="lg"
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

const MagicLinkSentMessage = () => (
  <div>
    <div className="space-y-4">
      <div className="bg-primary inline-flex items-center rounded-md p-1.5">
        <MailCheckIcon className="text-primary-foreground size-5" />
      </div>
      <div className="flex items-center gap-2">
        <Heading1>Email Sent</Heading1>
      </div>
      <Text>
        Please check your email for a magic link to sign in.
        <br />
        If you don&apos;t see the email, please check your spam folder.
      </Text>
    </div>
  </div>
);
