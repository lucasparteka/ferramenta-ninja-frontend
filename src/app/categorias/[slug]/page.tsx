import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/home/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { categoryContent } from "@/lib/data/category-content";
import { categories } from "@/lib/data/tools";
import {
	breadcrumbSchema,
	collectionPageSchema,
	faqSchema,
} from "@/lib/seo/jsonld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
	return categories.map((cat) => ({ slug: cat.id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { slug } = await params;
	const category = categories.find((c) => c.id === slug);
	if (!category) return {};

	const content = categoryContent[category.id];
	const description = content?.intro ?? category.description ?? "";

	return {
		title: `${category.name} — Ferramentas Online Gratuitas`,
		description,
		alternates: { canonical: `/categorias/${category.id}` },
		openGraph: {
			title: `${category.name} — Ferramenta Ninja`,
			description,
			url: `/categorias/${category.id}`,
			type: "website",
		},
	};
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<Params>;
}) {
	const { slug } = await params;
	const category = categories.find((c) => c.id === slug);
	if (!category) notFound();

	const content = categoryContent[category.id];
	const intro = content?.intro ?? category.description ?? "";
	const longDescription = content?.longDescription;
	const faq = content?.faq;
	const href = `/categorias/${category.id}`;

	const breadcrumbs = [
		{ label: "Início", href: "/" },
		{ label: "Categorias" },
		{ label: category.name, href },
	];

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<Breadcrumb items={breadcrumbs} />

			<div className="mb-8 max-w-2xl">
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					{category.name}
				</h1>
				<p className="text-lg text-muted-foreground">{intro}</p>
			</div>

			<Separator className="mb-7" />

			<section className="mb-12">
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Ferramentas desta categoria
				</h2>
				<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{category.tools.map((tool) => (
						<ToolCard key={tool.href} {...tool} />
					))}
				</div>
			</section>

			{longDescription && (
				<section className="mt-12 max-w-3xl space-y-4 text-muted-foreground">
					<h2 className="text-xl font-bold text-foreground">
						Sobre {category.name.toLowerCase()}
					</h2>
					<p>{longDescription}</p>
				</section>
			)}

			{faq && faq.length > 0 && (
				<section className="mt-12 max-w-3xl space-y-6">
					<h2 className="text-xl font-bold text-foreground">
						Perguntas frequentes
					</h2>
					<div className="space-y-6">
						{faq.map((item) => (
							<div key={item.question}>
								<h3 className="mb-1 font-semibold text-foreground">
									{item.question}
								</h3>
								<p className="text-muted-foreground">{item.answer}</p>
							</div>
						))}
					</div>
				</section>
			)}

			<JsonLd
				data={collectionPageSchema({
					name: category.name,
					description: intro,
					href,
					tools: category.tools.map((t) => ({
						name: t.name,
						href: t.href,
						description: t.description,
					})),
				})}
			/>
			<JsonLd data={breadcrumbSchema(breadcrumbs)} />
			{faq && faq.length > 0 && <JsonLd data={faqSchema(faq)} />}
		</div>
	);
}
