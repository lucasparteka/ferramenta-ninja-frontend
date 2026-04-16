import type { MetadataRoute } from "next";
import { categories } from "@/lib/data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://ferramenta.ninja";

	const toolUrls = categories
		.flatMap((cat) => cat.tools)
		.map((tool) => ({
			url: `${baseUrl}${tool.href}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		}));

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...toolUrls,
	];
}
