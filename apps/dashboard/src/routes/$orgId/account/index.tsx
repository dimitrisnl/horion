import {Suspense} from "react";

import {LoaderCircleIcon} from "@horionos/icons";
import {Badge} from "@horionos/ui/badge";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {Separator} from "@horionos/ui/separator";
import {Skeleton} from "@horionos/ui/skeleton";
import {toast} from "@horionos/ui/sonner";
import {Table, TableBody, TableCell, TableRow} from "@horionos/ui/table";
import {Strong, Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {z} from "zod/v4";

import {ContentLayout} from "~/components/app-skeleton/content-layout";
import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/$orgId/account/")({
  component: RouteComponent,
  loader({context}) {
    context.queryClient.prefetchQuery(orpc.session.getAll.queryOptions());
    context.queryClient.prefetchQuery(orpc.user.getCurrentUser.queryOptions());
    return;
  },
});

function RouteComponent() {
  return (
    <ContentLayout
      title="Account Settings"
      subtitle="Manage your account settings"
    >
      <UpdateNameSection />
      <Separator className="my-8" />
      <SessionsSection />
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
  } = useSuspenseQuery(orpc.user.getCurrentUser.queryOptions());

  const updateNameMutation = useMutation(
    orpc.user.updateName.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.user.getCurrentUser.queryOptions(),
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

const SessionsSection = () => {
  const LoadingRow = () => (
    <TableRow>
      <TableCell className="space-y-1 font-medium">
        <Skeleton className="h-[20px] w-[200px]" />
        <Skeleton className="h-[20px] w-[170px]" />
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );

  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Your sessions</Strong>
        <Text className="max-w-sm">
          Here&apos;s everywhere you&apos;ve logged in from
        </Text>
      </div>
      <div className="space-y-4">
        <Table>
          <TableBody>
            <Suspense
              fallback={
                <>
                  <LoadingRow />
                  <LoadingRow />
                </>
              }
            >
              <SessionTableRows />
            </Suspense>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

const SessionTableRows = () => {
  const {
    data: {sessions},
  } = useSuspenseQuery(orpc.session.getAll.queryOptions());
  const {
    data: {session},
  } = useSuspenseQuery(orpc.auth.getActiveSession.queryOptions());

  const activeSessionId = session?.id || "";

  return sessions.map((session) => (
    <TableRow key={session.id}>
      <TableCell className="space-y-0.5">
        <div className="font-medium">
          {session.browser} {" on "}
          {session.os}
        </div>
        <Text>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(session.createdAt)}
        </Text>
      </TableCell>
      <TableCell className="text-right">
        {session.id === activeSessionId ? (
          <Badge variant="outline">
            <div className="mr-1 inline-block size-2 rounded-full bg-emerald-500" />
            Active now
          </Badge>
        ) : (
          <> </>
        )}
      </TableCell>
    </TableRow>
  ));
};
