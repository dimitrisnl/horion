import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/magic-link-sent")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Email Sent</h1>
        <p className="text-muted-foreground text-sm">
          Please check your email for a magic link to sign in. If you don&apos;t
          see the email, please check your spam folder.
        </p>
      </div>
    </div>
  );
}
