import { z } from "zod";

const experienceSchema = z
	.object({
		id: z.string(),
		role: z.string().min(1, "Cargo é obrigatório"),
		company: z.string().min(1, "Empresa é obrigatória"),
		location: z.string().default(""),
		startDate: z.string().min(7, "Data de início é obrigatória"),
		endDate: z.string().default(""),
		isCurrent: z.boolean().default(false),
		description: z.string().default(""),
	})
	.superRefine((val, ctx) => {
		if (
			!val.isCurrent &&
			val.endDate &&
			val.startDate &&
			val.endDate < val.startDate
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Data de término não pode ser anterior à data de início",
				path: ["endDate"],
			});
		}
	});

const educationSchema = z
	.object({
		id: z.string(),
		institution: z.string().min(1, "Instituição é obrigatória"),
		degree: z.string().min(1, "Grau/Nível é obrigatório"),
		field: z.string().default(""),
		startYear: z.string().min(4, "Ano de início é obrigatório"),
		endYear: z.string().default(""),
		isCurrent: z.boolean().default(false),
		description: z.string().default(""),
	})
	.superRefine((val, ctx) => {
		if (
			!val.isCurrent &&
			val.endYear &&
			val.startYear &&
			val.endYear < val.startYear
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Ano de conclusão não pode ser anterior ao ano de início",
				path: ["endYear"],
			});
		}
	});

export const resumeFormSchema = z.object({
	name: z.string().min(2, "Nome completo é obrigatório"),
	headline: z.string().min(1, "Título profissional é obrigatório"),
	email: z.string().email("E-mail inválido"),
	phone: z
		.string()
		.min(14, "Telefone inválido. Ex: (48) 99999-9999")
		.max(15, "Telefone inválido"),
	location: z.string().default(""),
	title: z.string().optional().default(""),
	summary: z.string().optional().default(""),
	experiences: z.array(experienceSchema).default([]),
	education: z.array(educationSchema).default([]),
	skills: z
		.array(z.object({ id: z.string(), name: z.string().min(1) }))
		.default([]),
	languages: z
		.array(
			z.object({
				id: z.string(),
				name: z.string().min(1, "Idioma é obrigatório"),
				level: z.string().min(1, "Nível é obrigatório"),
			}),
		)
		.default([]),
	socialLinks: z
		.array(
			z.object({
				id: z.string(),
				platform: z.string().min(1, "Plataforma é obrigatória"),
				url: z.preprocess((val) => {
					if (
						typeof val === "string" &&
						val.length > 0 &&
						!/^https?:\/\//i.test(val)
					) {
						return "https://" + val;
					}
					return val;
				}, z.string().url("URL inválida")),
			}),
		)
		.default([]),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;
export type ExperienceEntry = ResumeFormValues["experiences"][number];
export type EducationEntry = ResumeFormValues["education"][number];
export type SkillEntry = ResumeFormValues["skills"][number];
export type LanguageEntry = ResumeFormValues["languages"][number];
export type SocialLinkEntry = ResumeFormValues["socialLinks"][number];
