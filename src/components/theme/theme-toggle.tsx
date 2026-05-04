"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
			aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
		>
			{isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
		</button>
	);
}
