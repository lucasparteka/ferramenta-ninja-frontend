import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { getSortedPosts } from "@/lib/data/blog-posts";
import { breadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Guias e artigos sobre direitos trabalhistas, finanças pessoais, validação de documentos e ferramentas online — escritos pela equipe Ferramenta Ninja.",
	alternates: { canonical: "/blog" },
	openGraph: {
		title: "Blog — Ferramenta Ninja",
		description:
			"Guias práticos sobre cálculos trabalhistas, finanças e validações.",
		url: "/blog",
		type: "website",
	},
};

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function BlogIndexPage() {
	const posts = getSortedPosts();
	const breadcrumbs = [
		{ label: "Início", href: "/" },
		{ label: "Blog", href: "/blog" },
	];

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "Blog Ferramenta Ninja",
		url: "https://ferramenta.ninja/blog",
		inLanguage: "pt-BR",
		blogPost: posts.map((p) => ({
			"@type": "BlogPosting",
			headline: p.title,
			url: `https://ferramenta.ninja/blog/${p.slug}`,
			datePublished: p.publishedAt,
			dateModified: p.updatedAt,
			author: { "@type": "Organization", name: p.author },
		})),
	};

	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
			<Breadcrumb items={breadcrumbs} />

			<div className="mb-8">
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Blog
				</h1>
				<p className="text-lg text-muted-foreground">
					Guias práticos sobre cálculos trabalhistas, finanças, validações e
					ferramentas online — sempre que possível com fórmulas, exemplos e
					links para a calculadora correspondente.
				</p>
			</div>

			<Separator className="mb-7" />

			<ul className="space-y-8">
				{posts.map((post) => (
					<li key={post.slug}>
						<article>
							<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								{post.category}
							</p>
							<h2 className="mb-2 text-xl font-bold text-foreground">
								<Link
									href={`/blog/${post.slug}`}
									className="transition-colors hover:text-primary"
								>
									{post.title}
								</Link>
							</h2>
							<p className="mb-2 text-sm text-muted-foreground">
								{post.description}
							</p>
							<div className="text-xs text-muted-foreground">
								<time dateTime={post.publishedAt}>
									{formatDate(post.publishedAt)}
								</time>
								<span aria-hidden="true"> · </span>
								<span>{post.author}</span>
							</div>
						</article>
					</li>
				))}
			</ul>

			<JsonLd data={blogSchema} />
			<JsonLd data={breadcrumbSchema(breadcrumbs)} />
		</div>
	);
}
