import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/shared/blog-layout";
import { blogPosts, findPostBySlug } from "@/lib/data/blog-posts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
	return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = findPostBySlug(slug);
	if (!post) return {};

	return {
		title: post.title,
		description: post.description,
		alternates: { canonical: `/blog/${post.slug}` },
		openGraph: {
			title: post.title,
			description: post.description,
			url: `/blog/${post.slug}`,
			type: "article",
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
		},
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<Params>;
}) {
	const { slug } = await params;
	const post = findPostBySlug(slug);
	if (!post) notFound();

	const Body = post.Component;

	return (
		<BlogLayout post={post}>
			<Body />
		</BlogLayout>
	);
}
