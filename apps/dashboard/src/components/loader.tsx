import {LoaderCircleIcon} from "@horionos/icons";

export function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}
