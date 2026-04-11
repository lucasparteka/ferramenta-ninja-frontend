export const TEMPLATE_IDS = ["classic", "traditional", "minimalist", "executivo", "moderno", "elegante"] as const
export type TemplateId = typeof TEMPLATE_IDS[number]

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: "Clássico",
  traditional: "Tradicional",
  minimalist: "Minimalista",
  executivo: "Executivo",
  moderno: "Moderno",
  elegante: "Elegante",
}

export const ACCENT_COLORS = [
  "#1f3a5f",
  "#3f7f7a",
  "#b89b5e",
  "#6b2c3e",
  "#4b5d3a",
  "#2f5fa3",
  "#2b2b2b",
  "#6b7280",
  "#8b5e3c",
] as const

export const ACCENT_COLOR_LABELS: Record<string, string> = {
  "#1f3a5f": "Azul Marinho",
  "#3f7f7a": "Verde Teal",
  "#b89b5e": "Dourado",
  "#6b2c3e": "Vinho",
  "#4b5d3a": "Verde Oliva",
  "#2f5fa3": "Azul Corporativo",
  "#2b2b2b": "Preto",
  "#6b7280": "Cinza Profissional",
  "#8b5e3c": "Marrom Executivo",
}

export const TEMPLATE_DEFAULT_COLORS: Record<TemplateId, string> = {
  classic: "#1b3a5c",
  traditional: "#2c3e50",
  minimalist: "#1c1c1c",
  executivo: "#4a9b8e",
  moderno: "#c0a86e",
  elegante: "#1b3a5c",
}

export const RESUME_FONT_OPTIONS = [
  { value: "--font-inter",    label: "Inter" },
  { value: "--font-jakarta",  label: "Plus Jakarta Sans" },
  { value: "--font-dm-sans",  label: "DM Sans" },
  { value: "--font-barlow",   label: "Barlow" },
  { value: "--font-lora",     label: "Lora (Serifa)" },
  { value: "--font-playfair", label: "Playfair Display (Serifa)" },
  { value: "--font-roboto",   label: "Roboto" },
] as const

export type ResumeFontVar = typeof RESUME_FONT_OPTIONS[number]["value"]
export const RESUME_FONT_DEFAULT: ResumeFontVar = "--font-inter"

export const RESUME_FONT_SIZE_OPTIONS = [
  { value: "xs",     label: "Muito pequena", zoom: 0.8   },
  { value: "small",  label: "Pequena",       zoom: 0.875 },
  { value: "medium", label: "Média",         zoom: 1.0   },
  { value: "large",  label: "Grande",        zoom: 1.125 },
  { value: "xl",     label: "Muito grande",  zoom: 1.25  },
  { value: "xxl",    label: "Extra grande",  zoom: 1.375 },
] as const

export type ResumeFontSize = typeof RESUME_FONT_SIZE_OPTIONS[number]["value"]
export const RESUME_FONT_SIZE_DEFAULT: ResumeFontSize = "medium"

export const DEFAULT_LAYOUT = {
  template: "classic" as TemplateId,
  color: TEMPLATE_DEFAULT_COLORS.classic,
  font: "--font-inter" as ResumeFontVar,
  size: "medium" as ResumeFontSize,
}
