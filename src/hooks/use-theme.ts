"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
	if (stored === "dark" || stored === "light") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function useTheme() {
	const [theme, setThemeState] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setThemeState(getInitialTheme());
	}, []);

	useEffect(() => {
		if (!mounted) return;
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme, mounted]);

	const setTheme = useCallback((t: Theme) => setThemeState(t), []);

	return { theme, setTheme, mounted };
}
