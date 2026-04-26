import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import type { BlogPost } from "@/lib/data/blog-posts";
import { findToolByHref } from "@/lib/data/tools";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/jsonld";

type BlogLayoutProps = {
	post: BlogPost;
	children: React.ReactNode;
};

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function BlogLayout({ post, children }: BlogLayoutProps) {
	const href = `/blog/${post.slug}`;

	const breadcrumbs = [
		{ label: "Início", href: "/" },
		{ label: "Blog", href: "/blog" },
		{ label: post.title, href },
	];

	const tools = post.relatedTools
		.map((toolHref) => findToolByHref(toolHref))
		.filter((t) => t !== undefined);

	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
			<Breadcrumb items={breadcrumbs} />

			<header className="mb-8">
				<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					{post.category}
				</p>
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					{post.title}
				</h1>
				<p className="text-lg text-muted-foreground">{post.description}</p>
				<div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
					<span>Por {post.author}</span>
					<span aria-hidden="true">·</span>
					<time dateTime={post.publishedAt}>
						Publicado em {formatDate(post.publishedAt)}
					</time>
					{post.updatedAt !== post.publishedAt && (
						<>
							<span aria-hidden="true">·</span>
							<time dateTime={post.updatedAt}>
								Atualizado em {formatDate(post.updatedAt)}
							</time>
						</>
					)}
				</div>
			</header>

			<Separator className="mb-7" />

			<article className="prose-fn space-y-5 text-foreground">
				{children}
			</article>

			{tools.length > 0 && (
				<section className="mt-12 rounded-lg border border-primary/30 bg-primary/5 p-6">
					<h2 className="mb-3 text-lg font-bold text-foreground">
						Ferramentas relacionadas
					</h2>
					<ul className="space-y-2">
						{tools.map((tool) => (
							<li key={tool.href}>
								<Link
									href={tool.href}
									className="text-primary underline underline-offset-2 hover:text-foreground"
								>
									{tool.name}
								</Link>
								<span className="ml-2 text-sm text-muted-foreground">
									— {tool.description}
								</span>
							</li>
						))}
					</ul>
				</section>
			)}

			<JsonLd
				data={articleSchema({
					title: post.title,
					description: post.description,
					href,
					publishedAt: post.publishedAt,
					updatedAt: post.updatedAt,
					author: post.author,
				})}
			/>
			<JsonLd data={breadcrumbSchema(breadcrumbs)} />
		</div>
	);
}
