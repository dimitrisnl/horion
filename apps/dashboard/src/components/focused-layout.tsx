import {AudioWaveformIcon} from "@horionos/icons";

import {UserDropdown} from "./user-dropdown";

export function Header() {
  return (
    <div>
      <header className="bg-background sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-6">
          <div className="flex w-full items-center gap-2">
            <div className="flex w-full items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="bg-primary text-primary-foreground flex size-7.5 items-center justify-center rounded-md">
                  <AudioWaveformIcon className="size-4" />
                </div>
              </div>
            </div>
            <UserDropdown />
          </div>
        </div>
      </header>
    </div>
  );
}

export const FocusedLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="relative min-h-svh">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};

export const MutedFocusedLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-muted/50 relative min-h-svh">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};
