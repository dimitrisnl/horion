import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {toast} from "@horionos/ui/sonner";

import {useForm} from "@tanstack/react-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "@tanstack/react-router";

import {z} from "zod/v4";

import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

export const CreateOrganizationForm = () => {
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
  const queryClient = useQueryClient();

  const createOrganizationMutation = useMutation(
    orpc.organization.create.mutationOptions({
      onSuccess: ({organization}) => {
        toast.success("Your organization has been created");
        queryClient.invalidateQueries(
          orpc.account.getMemberships.queryOptions(),
        );

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
