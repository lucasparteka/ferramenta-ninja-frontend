"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { GooglePreviewInput } from "./google-preview-input";
import { GooglePreviewResult } from "./google-preview-result";
import { GooglePreviewUrl } from "./google-preview-url";

type PreviewData = {
	title: string;
	description: string;
	url: string;
	keyword: string;
};

export function GooglePreviewTool() {
	const [data, setData] = useState<PreviewData>({
		title: "",
		description: "",
		url: "",
		keyword: "",
	});

	function handleUrlLoad(loaded: {
		title: string;
		description: string;
		url: string;
	}) {
		setData((prev) => ({
			...prev,
			title: loaded.title ?? "",
			description: loaded.description ?? "",
			url: loaded.url ?? "",
		}));
	}

	return (
		<div className="flex flex-col gap-6">
			<GooglePreviewUrl onLoad={handleUrlLoad} />
			<div className="relative flex items-center gap-3">
				<div className="h-px flex-1 bg-border" />
				<span className="text-xs text-muted-foreground">
					ou insira manualmente
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>
			<GooglePreviewInput data={data} onChange={setData} />
			<Separator />
			<GooglePreviewResult
				title={data.title}
				description={data.description}
				url={data.url}
				keyword={data.keyword}
			/>
		</div>
	);
}
