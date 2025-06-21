import {LoaderCircleIcon} from "@horion/icons";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}
