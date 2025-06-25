import {LoaderCircleIcon} from "@horionos/icons";

import {FocusedLayout} from "./app-skeleton/focused-layout";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}

export const LoadingSection = () => {
  return (
    <FocusedLayout>
      <Loader />
    </FocusedLayout>
  );
};
