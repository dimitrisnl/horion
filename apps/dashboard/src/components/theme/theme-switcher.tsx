import {CheckIcon, MoonIcon, SunIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";

import {useTheme} from "~/components/theme/theme-provider";

export function ThemeSwitcher() {
  const {setTheme, theme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <SunIcon className="scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-32">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon />
          Light
          {theme === "light" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon />
          Dark
          {theme === "dark" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
