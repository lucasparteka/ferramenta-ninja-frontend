import type { Template } from "./types";

export const TEMPLATES: Template[] = [
	{
		id: "classico",
		name: "Clássico",
		frontLayout: "classico",
		backLayout: "classico",
		defaultFront: {
			primaryColor: "#7c3aed",
			background: { type: "solid", color: "#ffffff" },
		},
		defaultBack: {
			primaryColor: "#7c3aed",
			background: { type: "solid", color: "#ffffff" },
		},
	},
	{
		id: "moderno",
		name: "Moderno",
		frontLayout: "moderno",
		backLayout: "moderno",
		defaultFront: {
			primaryColor: "#0f172a",
			background: { type: "solid", color: "#f8fafc" },
		},
		defaultBack: {
			primaryColor: "#0f172a",
			background: { type: "solid", color: "#f8fafc" },
		},
	},
	{
		id: "dividido",
		name: "Dividido",
		frontLayout: "dividido",
		backLayout: "dividido",
		defaultFront: {
			primaryColor: "#059669",
			background: { type: "solid", color: "#ffffff" },
		},
		defaultBack: {
			primaryColor: "#059669",
			background: { type: "solid", color: "#ffffff" },
		},
	},
	{
		id: "elegante",
		name: "Elegante",
		frontLayout: "elegante",
		backLayout: "elegante",
		defaultFront: {
			primaryColor: "#1c1917",
			background: { type: "solid", color: "#feac4d" },
		},
		defaultBack: {
			primaryColor: "#1c1917",
			background: { type: "solid", color: "#feac4d" },
		},
	},
	{
		id: "compacto",
		name: "Compacto",
		frontLayout: "compacto",
		backLayout: "compacto",
		defaultFront: {
			primaryColor: "#dc2626",
			background: { type: "solid", color: "#fff7ed" },
		},
		defaultBack: {
			primaryColor: "#dc2626",
			background: { type: "solid", color: "#fff7ed" },
		},
	},
	{
		id: "minimalista",
		name: "Minimalista",
		frontLayout: "minimalista",
		backLayout: "minimalista",
		defaultFront: {
			primaryColor: "#ffffff",
			background: { type: "solid", color: "#374151" },
		},
		defaultBack: {
			primaryColor: "#374151",
			background: { type: "solid", color: "#ffffff" },
		},
	},
	{
		id: "negrito",
		name: "Negrito",
		frontLayout: "negrito",
		backLayout: "negrito",
		defaultFront: {
			primaryColor: "#1d4ed8",
			background: { type: "solid", color: "#eff6ff" },
		},
		defaultBack: {
			primaryColor: "#1d4ed8",
			background: { type: "solid", color: "#eff6ff" },
		},
	},
	{
		id: "grade",
		name: "Grade",
		frontLayout: "grade",
		backLayout: "grade",
		defaultFront: {
			primaryColor: "#7c3aed",
			background: { type: "texture", color: "#ffffff", texture: "dots" },
		},
		defaultBack: {
			primaryColor: "#7c3aed",
			background: { type: "texture", color: "#ffffff", texture: "dots" },
		},
	},
];
