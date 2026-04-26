const SITE_URL = "https://ferramenta.ninja";
const SITE_NAME = "Ferramenta Ninja";

export type FaqItem = { question: string; answer: string };
export type BreadcrumbItem = { label: string; href?: string };

type ToolSchemaInput = {
	name: string;
	description: string;
	href: string;
	category?: string;
};

export function organizationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${SITE_URL}#organization`,
		name: SITE_NAME,
		url: SITE_URL,
		logo: {
			"@type": "ImageObject",
			url: `${SITE_URL}/api/og`,
		},
	};
}

export function websiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${SITE_URL}#website`,
		url: SITE_URL,
		name: SITE_NAME,
		inLanguage: "pt-BR",
		publisher: { "@id": `${SITE_URL}#organization` },
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${SITE_URL}/?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

export function webApplicationSchema(tool: ToolSchemaInput) {
	return {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: tool.name,
		description: tool.description,
		url: `${SITE_URL}${tool.href}`,
		applicationCategory: tool.category ?? "UtilitiesApplication",
		operatingSystem: "Any",
		browserRequirements: "Requires JavaScript",
		inLanguage: "pt-BR",
		isAccessibleForFree: true,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "BRL",
		},
		publisher: { "@id": `${SITE_URL}#organization` },
	};
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.label,
			...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
		})),
	};
}

export function faqSchema(items: FaqItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};
}

type ArticleSchemaInput = {
	title: string;
	description: string;
	href: string;
	publishedAt: string;
	updatedAt: string;
	author: string;
	imageUrl?: string;
};

export function articleSchema(input: ArticleSchemaInput) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: input.title,
		description: input.description,
		datePublished: input.publishedAt,
		dateModified: input.updatedAt,
		inLanguage: "pt-BR",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${SITE_URL}${input.href}`,
		},
		author: {
			"@type": "Organization",
			name: input.author,
			url: SITE_URL,
		},
		publisher: { "@id": `${SITE_URL}#organization` },
		image: input.imageUrl ?? `${SITE_URL}/api/og`,
	};
}

export function collectionPageSchema(input: {
	name: string;
	description: string;
	href: string;
	tools: { name: string; href: string; description: string }[];
}) {
	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: input.name,
		description: input.description,
		url: `${SITE_URL}${input.href}`,
		inLanguage: "pt-BR",
		isPartOf: { "@id": `${SITE_URL}#website` },
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: input.tools.length,
			itemListElement: input.tools.map((tool, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: `${SITE_URL}${tool.href}`,
				name: tool.name,
				description: tool.description,
			})),
		},
	};
}
