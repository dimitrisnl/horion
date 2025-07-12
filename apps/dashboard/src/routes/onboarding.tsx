import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@horionos/ui/card";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {toast} from "@horionos/ui/sonner";
import {Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {useMutation} from "@tanstack/react-query";
import {createFileRoute, useNavigate} from "@tanstack/react-router";

import {z} from "zod/v4";

import {MutedFocusedLayout} from "~/components/focused-layout";
import {useLogout} from "~/hooks/use-log-out";
import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const {logOut} = useLogout();

  return (
    <MutedFocusedLayout>
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <Button variant="link" onClick={logOut}>
          Log out
        </Button>
      </div>
      <div className="flex w-full max-w-lg flex-col gap-6 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s create your Organization</CardTitle>
            <CardDescription>
              <Text>To get started, please enter your organization name.</Text>
              <Text>Don&apos;t worry, you can change it later.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm />
          </CardContent>
        </Card>
      </div>
    </MutedFocusedLayout>
  );
}

const CreateOrganizationForm = () => {
  const {form} = useOrganizationCreateForm();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-4">
        <form.Field name="name">
          {(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Organization Name</Label>
              <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-destructive text-sm">
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
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : null}
              {state.isSubmitting ? "Saving..." : "Create and Continue"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

const useOrganizationCreateForm = () => {
  const navigate = useNavigate();

  const createOrganizationMutation = useMutation(
    orpc.organization.create.mutationOptions({
      onSuccess: ({organization}) => {
        toast.success("Your organization has been created");
        navigate({to: "/$orgId", params: {orgId: organization.id}});
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create organization");
      },
    }),
  );

  const form = useForm({
    defaultValues: {name: ""},
    validators: {
      onSubmitAsync: ({value: {name}}) => {
        return withValidationErrors(
          createOrganizationMutation.mutateAsync({name}),
        );
      },
      onSubmit: z.object({
        name: z
          .string()
          .trim()
          .min(2, "Name must be at least 2 characters")
          .max(100, "Name must be less than 100 characters"),
      }),
    },
  });

  return {form};
};
