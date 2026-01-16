"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { UIButton } from "../UIButton";

const ThemeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <UIButton
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </UIButton>
  );
};

export default ThemeSwitch;
