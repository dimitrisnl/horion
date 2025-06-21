import {LoaderCircleIcon} from "@horion/icons";
import {Button} from "@horion/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@horion/ui/card";
import {Input} from "@horion/ui/input";
import {Label} from "@horion/ui/label";
import {toast} from "@horion/ui/sonner";

import {useForm} from "@tanstack/react-form";
import {useMutation} from "@tanstack/react-query";
import {createFileRoute, useNavigate} from "@tanstack/react-router";

import {z} from "zod/v4";

import {FocusedLayout} from "~/components/focused-layout";
import {orpc, queryClient} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
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

  const logout = () => {
    orpc.auth.signOut.call().then(() => {
      queryClient.clear();
      navigate({to: "/login", replace: true});
    });
  };

  return (
    <FocusedLayout>
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <Button variant="link" onClick={logout}>
          Log out
        </Button>
      </div>
      <div className="flex w-full max-w-lg flex-col gap-6 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s create your Organization</CardTitle>
            <CardDescription>
              To get started, please enter your organization name. Don&apos;t
              worry, you can change it later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                        {field.state.meta.errors.map((error) => (
                          <p
                            key={error?.message}
                            className="text-destructive text-sm"
                          >
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
                        {state.isSubmitting
                          ? "Saving..."
                          : "Create and Continue"}
                      </Button>
                    )}
                  </form.Subscribe>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </FocusedLayout>
  );
}
