import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data/blog-posts";
import { categories, getAllTools } from "@/lib/data/tools";

const BASE_URL = "https://ferramenta.ninja";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	const toolUrls: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
		url: `${BASE_URL}${tool.href}`,
		lastModified: now,
		changeFrequency: "monthly",
		priority: 0.8,
	}));

	const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
		url: `${BASE_URL}/categorias/${cat.id}`,
		lastModified: now,
		changeFrequency: "monthly",
		priority: 0.9,
	}));

	const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
		url: `${BASE_URL}/blog/${post.slug}`,
		lastModified: new Date(post.updatedAt),
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	const staticUrls: MetadataRoute.Sitemap = [
		"/sobre",
		"/metodologia",
		"/contato",
		"/politica-de-privacidade",
		"/termos-de-uso",
	].map((path) => ({
		url: `${BASE_URL}${path}`,
		lastModified: now,
		changeFrequency: "yearly",
		priority: 0.5,
	}));

	return [
		{
			url: BASE_URL,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${BASE_URL}/ferramentas`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		...categoryUrls,
		...toolUrls,
		...blogUrls,
		...staticUrls,
	];
}
