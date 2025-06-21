import ReactDOM from "react-dom/client";

import {QueryClientProvider} from "@tanstack/react-query";
import {createRouter, RouterProvider} from "@tanstack/react-router";

import {FocusedLayout} from "./components/focused-layout";
import Loader from "./components/loader";
import {routeTree} from "./routeTree.gen";
import {orpc, queryClient} from "./utils/orpc";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => (
    <FocusedLayout>
      <Loader />
    </FocusedLayout>
  ),
  context: {orpc, queryClient},
  Wrap: function WrapComponent({children}: {children: React.ReactNode}) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
