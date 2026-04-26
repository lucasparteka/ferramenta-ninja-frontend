import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/home/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { categories, getAllTools } from "@/lib/data/tools";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
	title: "Todas as Ferramentas",
	description:
		"Catálogo completo de ferramentas online gratuitas: calculadoras, conversores, geradores, validadores e muito mais. Sem cadastro, sem instalação.",
	alternates: { canonical: "/ferramentas" },
	openGraph: {
		title: "Todas as Ferramentas — Ferramenta Ninja",
		description:
			"Catálogo completo de ferramentas online gratuitas. Sem cadastro, sem instalação.",
		url: "/ferramentas",
		type: "website",
	},
};

export default function ToolsCatalogPage() {
	const allTools = getAllTools();
	const breadcrumbs = [
		{ label: "Início", href: "/" },
		{ label: "Ferramentas", href: "/ferramentas" },
	];

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<Breadcrumb items={breadcrumbs} />

			<div className="mb-8 max-w-2xl">
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Todas as ferramentas
				</h1>
				<p className="text-lg text-muted-foreground">
					{allTools.length} ferramentas online gratuitas, organizadas por
					categoria. Sem cadastro, sem instalação.
				</p>
			</div>

			<Separator className="mb-7" />

			<div className="space-y-12">
				{categories.map((category) => (
					<section
						key={category.id}
						id={`categoria-${category.id}`}
						className="scroll-mt-20"
					>
						<div className="mb-4 flex items-baseline justify-between gap-4">
							<h2 className="text-xl font-bold text-foreground">
								<Link
									href={`/categorias/${category.id}`}
									className="transition-colors hover:text-primary"
								>
									{category.name}
								</Link>
							</h2>
							<Link
								href={`/categorias/${category.id}`}
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								Ver categoria →
							</Link>
						</div>
						{category.description && (
							<p className="mb-4 text-sm text-muted-foreground">
								{category.description}
							</p>
						)}
						<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{category.tools.map((tool) => (
								<ToolCard key={tool.href} {...tool} />
							))}
						</div>
					</section>
				))}
			</div>

			<JsonLd
				data={collectionPageSchema({
					name: "Todas as Ferramentas",
					description:
						"Catálogo completo de ferramentas online gratuitas do Ferramenta Ninja.",
					href: "/ferramentas",
					tools: allTools.map((t) => ({
						name: t.name,
						href: t.href,
						description: t.description,
					})),
				})}
			/>
			<JsonLd data={breadcrumbSchema(breadcrumbs)} />
		</div>
	);
}
