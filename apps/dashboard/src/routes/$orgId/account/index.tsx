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
import {Heading2, Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {z} from "zod/v4";

import {PageLayout} from "~/components/layout/page-layout";
import {minutes} from "~/utils/minutes";
import {orpc, queryClient} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const Route = createFileRoute("/$orgId/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: {user, session},
  } = useSuspenseQuery(
    orpc.auth.getSession.queryOptions({
      staleTime: minutes(5),
    }),
  );

  if (!user || !session || !session.token) {
    return null;
  }

  return (
    <PageLayout title="User">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <UpdateNameSection defaultName={user.name ?? ""} />
        <Separator className="my-16" />
        <SessionsSection activeSessionToken={session.token} />
      </div>
    </PageLayout>
  );
}

const UpdateNameSection = ({defaultName}: {defaultName: string}) => {
  const updateNameMutation = useMutation(
    orpc.user.updateName.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.auth.getSession.queryOptions());
        toast.success("Your name has been updated");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update your name");
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
          .min(1, "Name is required")
          .max(50, "Name must be less than 50 characters"),
      }),
      onSubmitAsync: ({value: {name}}) => {
        return withValidationErrors(updateNameMutation.mutateAsync({name}));
      },
    },
  });

  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Heading2>Change your full name</Heading2>
        <Text className="max-w-sm">
          Your full name is used to identify you in the app
        </Text>
      </div>
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
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
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
      </div>
    </section>
  );
};

const SessionsSection = ({
  activeSessionToken,
}: {
  activeSessionToken: string;
}) => {
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
        <Heading2>Your sessions</Heading2>
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
              <SessionTableRows activeSessionToken={activeSessionToken} />
            </Suspense>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

const SessionTableRows = ({
  activeSessionToken,
}: {
  activeSessionToken: string;
}) => {
  const {
    data: {sessions},
  } = useSuspenseQuery(orpc.session.getAll.queryOptions());

  return sessions.map((session) => (
    <TableRow key={session.token}>
      <TableCell className="font-medium">
        <div>
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
        {session.token === activeSessionToken ? (
          <Badge variant="secondary">This browser</Badge>
        ) : (
          <> </>
        )}
      </TableCell>
    </TableRow>
  ));
};
