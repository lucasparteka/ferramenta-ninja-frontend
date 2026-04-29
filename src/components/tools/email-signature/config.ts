import type { TemplateId } from "./types";

export const TEMPLATE_IDS: TemplateId[] = [
	"minimal",
	"professional",
	"modern",
	"classic",
	"photo",
	"banner",
];

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
	minimal: "Minimalista",
	professional: "Profissional",
	modern: "Moderno",
	classic: "Clássico",
	photo: "Com Foto",
	banner: "Com Banner",
};

export const PRESET_SWATCHES = [
	"#000000",
	"#1a1a1a",
	"#4a4a4a",
	"#6b7280",
	"#dc2626",
	"#ea580c",
	"#d97706",
	"#65a30d",
	"#16a34a",
	"#0891b2",
	"#2563eb",
	"#7c3aed",
	"#db2777",
	"#be123c",
];

export const DEFAULT_COLORS = {
	primary: "#2563eb",
	secondary: "#64748b",
};

export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 18;
export const FONT_SIZE_DEFAULT = 14;

export const SPACING_OPTIONS = ["compact", "normal", "spacious"] as const;

export const SOCIAL_NETWORKS = [
	{ id: "linkedin", label: "LinkedIn" },
	{ id: "instagram", label: "Instagram" },
	{ id: "facebook", label: "Facebook" },
	{ id: "x", label: "X (Twitter)" },
	{ id: "youtube", label: "YouTube" },
	{ id: "github", label: "GitHub" },
	{ id: "whatsapp", label: "WhatsApp" },
] as const;
