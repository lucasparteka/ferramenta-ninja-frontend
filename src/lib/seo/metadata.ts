import type { Metadata } from "next";
import type { Tool } from "@/lib/data/tools";

type ToolMetadataInput = {
	tool: Tool;
	title: string;
	description: string;
	keywords?: string[];
};

export function toolMetadata({
	tool,
	title,
	description,
	keywords,
}: ToolMetadataInput): Metadata {
	return {
		title,
		description,
		keywords,
		alternates: {
			canonical: tool.href,
		},
		openGraph: {
			title,
			description,
			url: tool.href,
			type: "website",
		},
	};
}
