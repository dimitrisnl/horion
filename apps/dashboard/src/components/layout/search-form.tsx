import {useId} from "react";

import {SearchIcon} from "@horion/icons";
import {Label} from "@horion/ui/label";
import {SidebarInput} from "@horion/ui/sidebar";

export function SearchForm({...props}: React.ComponentProps<"form">) {
  const id = useId();
  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id={`search-${id}`}
          placeholder="Type to search..."
          className="h-8 pl-7"
        />
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  );
}
