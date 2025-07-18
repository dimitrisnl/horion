import {Suspense} from "react";

import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {Separator} from "@horionos/ui/separator";
import {Skeleton} from "@horionos/ui/skeleton";
import {toast} from "@horionos/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@horionos/ui/table";
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
import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/_protected/$orgId/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout title="Organization Settings">
      <OrganizationNameSection />
      <Separator className="my-12" />
      <OrganizationMembersSection />
    </ContentLayout>
  );
}

const OrganizationNameSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Update your organization name</Strong>
        <Text className="max-w-sm">
          This name will be displayed to all members of your organization.
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
          <OrganizationNameForm />
        </Suspense>
      </div>
    </section>
  );
};

export const OrganizationNameForm = () => {
  const organizationId = useOrgId();
  const {form} = useOrganizationNameForm({organizationId});

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

const useOrganizationNameForm = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const queryClient = useQueryClient();

  const {
    data: {organization},
  } = useSuspenseQuery(
    orpc.organization.get.queryOptions({
      input: {id: organizationId},
    }),
  );

  const updateOrganizationNameMutation = useMutation(
    orpc.organization.update.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            orpc.organization.get.queryOptions({
              input: {id: organizationId},
            }),
          ),
          queryClient.invalidateQueries(
            orpc.account.getMemberships.queryOptions(),
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
    defaultValues: {name: organization.name},
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
            id: organizationId,
          }),
        );
      },
    },
  });

  return {
    form,
  };
};

const LoadingRow = () => (
  <TableRow>
    <TableCell className="space-y-1 font-medium">
      <Skeleton className="h-[20px] w-[200px]" />
      <Skeleton className="h-[20px] w-[170px]" />
    </TableCell>
  </TableRow>
);

const OrganizationMembersSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Manage your organization members</Strong>
        <Text className="max-w-sm">
          Here&apos;s all the members of your organization.
        </Text>
      </div>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow disableHover>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense
              fallback={
                <>
                  <LoadingRow />
                  <LoadingRow />
                </>
              }
            >
              <OrganizationMembersList />
            </Suspense>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

const OrganizationMembersList = () => {
  const organizationId = useOrgId();
  const {
    data: {memberships},
  } = useSuspenseQuery(
    orpc.organization.getMemberships.queryOptions({
      input: {organizationId},
    }),
  );

  return memberships.map((membership) => (
    <TableRow key={membership.memberId}>
      <TableCell>
        <Strong>{membership.memberEmail}</Strong>
        {membership.memberName ? (
          <Text className="text-muted-foreground">
            ({membership.memberName})
          </Text>
        ) : null}
      </TableCell>
      <TableCell>
        <MembershipRoleBadge role={membership.role} />
      </TableCell>
    </TableRow>
  ));
};
