import {Suspense} from "react";

import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {Skeleton} from "@horionos/ui/skeleton";
import {toast} from "@horionos/ui/sonner";
import {Strong, Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {z} from "zod/v4";

import {ContentLayout} from "~/components/content-layout";
import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/_protected/account/")({
  component: RouteComponent,
  loader({context}) {
    context.queryClient.prefetchQuery(orpc.account.getSessions.queryOptions());
    context.queryClient.prefetchQuery(
      orpc.account.getCurrentUser.queryOptions(),
    );
    return {};
  },
});

function RouteComponent() {
  return (
    <ContentLayout title="Account Settings">
      <UpdateNameSection />
    </ContentLayout>
  );
}

const UpdateNameSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Change your full name</Strong>
        <Text className="max-w-sm">
          Your full name is used to identify you in the app
        </Text>
      </div>
      <div className="space-y-4">
        <Suspense
          fallback={
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="ml-auto h-9 w-32" />
            </div>
          }
        >
          <UpdateNameForm />
        </Suspense>
      </div>
    </section>
  );
};

const UpdateNameForm = () => {
  const {form} = useUpdateNameForm();

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
              <Label htmlFor={field.name}>Name</Label>
              <Input
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
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : null}
                {state.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

const useUpdateNameForm = () => {
  const queryClient = useQueryClient();
  const {
    data: {user},
  } = useSuspenseQuery(orpc.account.getCurrentUser.queryOptions());

  const updateNameMutation = useMutation(
    orpc.account.updateName.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.account.getCurrentUser.queryOptions(),
        );
        toast.success("Your name has been updated");
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update your name");
      },
    }),
  );

  const form = useForm({
    defaultValues: {name: user.name || ""},

    validators: {
      onSubmit: z.object({
        name: z
          .string()
          .trim()
          .min(1, "Name is required")
          .max(50, "Name must be less than 50 characters"),
      }),
      onSubmitAsync: ({value: {name}}) => {
        return withValidationErrors(updateNameMutation.mutateAsync({name}));
      },
    },
  });

  return {form};
};
