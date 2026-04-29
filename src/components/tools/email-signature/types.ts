export type TemplateId =
	| "minimal"
	| "professional"
	| "modern"
	| "classic"
	| "photo"
	| "banner";

export type SocialNetwork =
	| "linkedin"
	| "instagram"
	| "facebook"
	| "x"
	| "youtube"
	| "github"
	| "whatsapp";

export interface SocialLink {
	network: SocialNetwork;
	url: string;
}

export interface EmailSignatureData {
	// Informações pessoais
	fullName: string;
	jobTitle: string;
	company: string;
	department: string;

	// Contato
	email: string;
	phone: string;
	mobile: string;
	address: string;
	website: string;

	// Redes sociais
	socials: SocialLink[];

	// Imagens
	photoUrl: string;
	logoUrl: string;
	bannerUrl: string;

	// Aparência
	template: TemplateId;
	primaryColor: string;
	secondaryColor: string;
	fontSize: number;
	spacing: "compact" | "normal" | "spacious";

	// Extras
	greeting: string;
	includeDisclaimer: boolean;
	disclaimerText: string;
	ctaText: string;
	ctaUrl: string;
}
