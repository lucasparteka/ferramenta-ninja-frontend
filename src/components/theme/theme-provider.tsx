"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	useTheme(); // hook aplica a classe .dark no mount
	return <>{children}</>;
}
