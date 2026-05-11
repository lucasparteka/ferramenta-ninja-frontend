import { JsonLd } from "@/components/seo/json-ld";
import { findCategoryByToolHref, findToolByHref } from "@/lib/data/tools";
import {
	type BreadcrumbItem,
	breadcrumbSchema,
	type FaqItem,
	faqSchema,
	webApplicationSchema,
} from "@/lib/seo/jsonld";
import { Breadcrumb } from "./breadcrumb";
import { CategoryToolsSection } from "./category-tools-section";

type PageLayoutProps = {
	title: string;
	description: string;
	children: React.ReactNode;
	toolHref?: string;
	compact?: boolean;
	faq?: FaqItem[];
	relatedTools?: React.ReactNode;
	extraContent?: React.ReactNode;
};

export function PageLayout({
	title,
	description,
	children,
	toolHref,
	faq,
	relatedTools,
	extraContent,
	compact,
}: PageLayoutProps) {
	const tool = toolHref ? findToolByHref(toolHref) : undefined;
	const category = toolHref ? findCategoryByToolHref(toolHref) : undefined;

	const breadcrumbs: BreadcrumbItem[] = tool
		? [
				{ label: "Início", href: "/" },
				...(category
					? [{ label: category.name, href: `/categorias/${category.id}` }]
					: []),
				{ label: tool.name, href: tool.href },
			]
		: [];

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{tool && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					{title}
				</h1>
				<p className="text-sm text-muted-foreground max-w-xl lg:mt-2">
					{description}
				</p>
			</div>
			{/* <div className="border-t border-border my-6" /> */}
			{compact
				? //
					children
				: children}

			{toolHref && <CategoryToolsSection currentHref={toolHref} />}

			{relatedTools && <div className="mt-12">{relatedTools}</div>}

			{extraContent && (
				<div className="mt-12 space-y-8 text-muted-foreground">
					{extraContent}
				</div>
			)}

			{faq && faq.length > 0 && <FaqSection items={faq} />}

			{tool && (
				<>
					<JsonLd
						data={webApplicationSchema({
							name: tool.name,
							description: tool.description,
							href: tool.href,
							category: category?.name,
						})}
					/>
					<JsonLd data={breadcrumbSchema(breadcrumbs)} />
				</>
			)}
			{faq && faq.length > 0 && <JsonLd data={faqSchema(faq)} />}
		</div>
	);
}

function FaqSection({ items }: { items: FaqItem[] }) {
	return (
		<section className="mt-12 space-y-6">
			<h2 className="text-base font-semibold text-foreground">
				Perguntas frequentes
			</h2>
			<div className="space-y-6">
				{items.map((item) => (
					<div key={item.question}>
						<h3 className="mb-1 font-semibold text-foreground">
							{item.question}
						</h3>
						<p className="text-muted-foreground">{item.answer}</p>
					</div>
				))}
			</div>
		</section>
	);
}
