"use client";

import { useState } from "react";
import { GooglePreviewInput } from "@/components/tools/google-preview/google-preview-input";
import { GooglePreviewResult } from "@/components/tools/google-preview/google-preview-result";
import { GooglePreviewUrl } from "@/components/tools/google-preview/google-preview-url";
import { Separator } from "@/components/ui/separator";

export default function GooglePreviewPage() {
	const [data, setData] = useState({
		title: "",
		description: "",
		url: "",
		keyword: "",
	});

	return (
		<div className="mx-auto max-w-3xl py-10 flex flex-col gap-6">
			<h1 className="text-2xl font-bold">
				Simulador de resultado do Google (SEO Preview)
			</h1>

			<p className="text-muted-foreground">
				Visualize como seu site aparece nos resultados do Google.
			</p>

			<GooglePreviewUrl onLoad={setData} />

			<Separator />

			<GooglePreviewInput data={data} onChange={setData} />

			<Separator />

			<GooglePreviewResult
				title={data.title}
				description={data.description}
				url={data.url}
			/>
		</div>
	);
}
