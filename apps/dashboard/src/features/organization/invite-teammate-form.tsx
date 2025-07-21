import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@horionos/ui/select";
import {toast} from "@horionos/ui/sonner";

import {useForm} from "@tanstack/react-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {z} from "zod/v4";

import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

type InvitationRole = "member" | "admin";

export const InviteTeammateForm = () => {
  const organizationId = useOrgId();
  const {form} = useInviteTeammateForm({organizationId});

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1">
            <form.Field name="email">
              {(field) => (
                <div className="grid gap-3">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type="email"
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
          </div>
          <div className="shrink-0">
            <form.Field name="role">
              {(field) => (
                <div className="grid gap-3">
                  <Label htmlFor={field.name}>Role</Label>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as InvitationRole)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
          </div>
        </div>

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
                {state.isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

const useInviteTeammateForm = ({organizationId}: {organizationId: string}) => {
  const queryClient = useQueryClient();

  const inviteTeammateMutation = useMutation(
    orpc.invitation.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.invitation.getAll.queryOptions({input: {organizationId}}),
        );
        toast.success("Invitation sent successfully");
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to invite teammate");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      email: "",
      role: "member" as InvitationRole,
    },
    validators: {
      onSubmit: z.object({
        email: z.email().trim(),
        role: z.enum(["member", "admin"]),
      }),
      onSubmitAsync: ({value: {email, role}}) => {
        return withValidationErrors(
          inviteTeammateMutation.mutateAsync({
            email,
            organizationId,
            role,
          }),
        );
      },
    },
  });

  return {
    form,
  };
};
