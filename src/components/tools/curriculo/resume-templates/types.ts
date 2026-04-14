export type ResumeTemplateData = {
	name: string;
	headline: string;
	email: string;
	phone: string;
	location?: string;
	summary?: string;
	photoUrl?: string | null;
	socialLinks?: { platform: string; url: string }[];
	experiences?: {
		role: string;
		company: string;
		location?: string;
		startDate: string;
		endDate?: string;
		isCurrent: boolean;
		description?: string;
	}[];
	education?: {
		institution: string;
		degree: string;
		field?: string;
		startYear: string;
		endYear?: string;
		isCurrent: boolean;
		description?: string;
	}[];
	skills?: { name: string }[];
	languages?: { name: string; level: string }[];
};
