import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {Skeleton} from "@horionos/ui/skeleton";
import {toast} from "@horionos/ui/sonner";
import {Heading2, Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {z} from "zod/v4";

import {PageLayout} from "~/components/app-skeleton/page-layout";
import {orpc, queryClient} from "~/utils/orpc";
import {useOrgId} from "~/utils/use-org-id";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/$orgId/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const orgId = useOrgId();

  const {data, isPending} = useQuery(
    orpc.organization.get.queryOptions({
      input: {organizationId: orgId},
    }),
  );

  return (
    <PageLayout title="Settings">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Heading2>Change your organization name</Heading2>
            <Text className="max-w-sm">
              This name will be displayed to all members of your organization .
              It can be changed at any time, but it is recommended to keep it
              consistent to avoid confusion.
            </Text>
          </div>
          <div className="space-y-4">
            {isPending ? (
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Skeleton className="h-3.5 w-12" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="ml-auto h-9 w-32" />
              </div>
            ) : (
              <OrganizationNameForm
                defaultName={data?.organization?.name ?? ""}
                organizationId={orgId}
              />
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export const OrganizationNameForm = ({
  defaultName,
  organizationId,
}: {
  defaultName: string;
  organizationId: string;
}) => {
  const updateOrganizationNameMutation = useMutation(
    orpc.organization.update.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(orpc.membership.getAll.queryOptions()),
          queryClient.invalidateQueries(
            orpc.organization.get.queryOptions({
              input: {organizationId},
            }),
          ),
        ]);

        toast.success("Organization name has been updated");
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update organization name");
      },
    }),
  );

  const form = useForm({
    defaultValues: {name: defaultName},
    validators: {
      onSubmit: z.object({
        name: z
          .string()
          .trim()
          .min(2, "Name must be at least 2 characters")
          .max(100, "Name must be less than 100 characters"),
      }),
      onSubmitAsync: ({value: {name}}) => {
        return withValidationErrors(
          updateOrganizationNameMutation.mutateAsync({
            name,
            organizationId,
          }),
        );
      },
    },
  });

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
