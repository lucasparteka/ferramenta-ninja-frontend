import type { Template } from "./types";

export const TEMPLATES: Template[] = [
	{
		id: "classico",
		name: "Clássico",
		frontLayout: "classico",
		backLayout: "classico",
		defaultFront: {
			primaryColor: "#F8FAFC",
			background: { type: "solid", color: "#0F172A" },
		},
		defaultBack: {
			primaryColor: "#F8FAFC",
			background: { type: "solid", color: "#0F172A" },
		},
	},
	{
		id: "moderno",
		name: "Moderno",
		frontLayout: "moderno",
		backLayout: "moderno",
		defaultFront: {
			primaryColor: "#F8FAFC",
			background: { type: "solid", color: "#020617" },
		},
		defaultBack: {
			primaryColor: "#F8FAFC",
			background: { type: "solid", color: "#020617" },
		},
	},
	{
		id: "dividido",
		name: "Dividido",
		frontLayout: "dividido",
		backLayout: "dividido",
		defaultFront: {
			primaryColor: "#F8FAFC",
			background: {
				type: "gradient",
				color1: "#0F172A",
				color2: "#1E293B",
				direction: "to-right",
			},
		},
		defaultBack: {
			primaryColor: "#F8FAFC",
			background: {
				type: "gradient",
				color1: "#0F172A",
				color2: "#1E293B",
				direction: "to-bottom",
			},
		},
	},
	{
		id: "elegante",
		name: "Elegante",
		frontLayout: "elegante",
		backLayout: "elegante",
		defaultFront: {
			primaryColor: "#F8FAFC",
			background: { type: "solid", color: "#111827" },
		},
		defaultBack: {
			primaryColor: "#111827",
			background: { type: "solid", color: "#111827" },
		},
	},
	{
		id: "compacto",
		name: "Compacto",
		frontLayout: "compacto",
		backLayout: "compacto",
		defaultFront: {
			primaryColor: "#F1F5F9",
			background: { type: "solid", color: "#1E293B" },
		},
		defaultBack: {
			primaryColor: "#F1F5F9",
			background: { type: "solid", color: "#1E293B" },
		},
	},
	{
		id: "minimalista",
		name: "Minimalista",
		frontLayout: "minimalista",
		backLayout: "minimalista",
		defaultFront: {
			primaryColor: "#E2E8F0",
			background: { type: "solid", color: "#18181B" },
		},
		defaultBack: {
			primaryColor: "#E2E8F0",
			background: { type: "solid", color: "#09090B" },
		},
	},
	{
		id: "negrito",
		name: "Negrito",
		frontLayout: "negrito",
		backLayout: "negrito",
		defaultFront: {
			primaryColor: "#FFFFFF",
			background: { type: "solid", color: "#1D4ED8" },
		},
		defaultBack: {
			primaryColor: "#FFFFFF",
			background: { type: "solid", color: "#1E40AF" },
		},
	},
	{
		id: "grade",
		name: "Grade",
		frontLayout: "grade",
		backLayout: "grade",
		defaultFront: {
			primaryColor: "#F8FAFC",
			background: {
				type: "texture",
				color: "#020617",
				texture: "grid",
			},
		},
		defaultBack: {
			primaryColor: "#F8FAFC",
			background: {
				type: "texture",
				color: "#020617",
				texture: "lines",
			},
		},
	},
];
