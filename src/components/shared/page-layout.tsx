import { JsonLd } from "@/components/seo/json-ld";
import { findCategoryByToolHref, findToolByHref } from "@/lib/data/tools";
import {
	type BreadcrumbItem,
	breadcrumbSchema,
	type FaqItem,
	faqSchema,
	webApplicationSchema,
} from "@/lib/seo/jsonld";
import { Separator } from "../ui/separator";
import { Breadcrumb } from "./breadcrumb";
import { ToolSidebar } from "./tool-sidebar";

type PageLayoutProps = {
	title: string;
	description: string;
	children: React.ReactNode;
	toolHref?: string;
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

	const hasSidebar = Boolean(tool);

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			{tool && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

			<div className="mb-8 max-w-2xl">
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					{title}
				</h1>
				<p className="text-lg text-muted-foreground">{description}</p>
			</div>
			<Separator className="mb-5 lg:mb-7" />

			{hasSidebar && tool ? (
				<div className="grid gap-8 lg:grid-cols-[1fr_280px]">
					<div className="min-w-0">
						{children}
						{relatedTools && <div className="mt-12">{relatedTools}</div>}
						{extraContent && (
							<div className="mt-12 space-y-8 text-muted-foreground">
								{extraContent}
							</div>
						)}
						{faq && faq.length > 0 && <FaqSection items={faq} />}
					</div>
					<ToolSidebar currentHref={tool.href} />
				</div>
			) : (
				<>
					{children}
					{relatedTools && <div className="mt-12">{relatedTools}</div>}
					{extraContent && (
						<div className="mt-12 space-y-8 text-muted-foreground">
							{extraContent}
						</div>
					)}
					{faq && faq.length > 0 && <FaqSection items={faq} />}
				</>
			)}

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
			<h2 className="text-xl font-bold text-foreground">
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
