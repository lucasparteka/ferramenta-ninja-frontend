"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data/tools";
import { ToolCard } from "./tool-card";

function normalize(text: string) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

export function ToolSearch() {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		if (!query.trim()) return categories;

		const q = normalize(query);

		return categories
			.map((category) => ({
				...category,
				tools: category.tools.filter((tool) =>
					normalize(`${tool.name} ${tool.description}`).includes(q),
				),
			}))
			.filter((category) => category.tools.length > 0);
	}, [query]);

	return (
		<div className="flex flex-col gap-6">
			<Input
				type="text"
				placeholder="Buscar ferramenta..."
				aria-label="Buscar ferramenta"
				value={query}
				className="lg:h-11"
				onChange={(e) => setQuery(e.target.value)}
				autoComplete="off"
			/>

			<div className="space-y-6">
				{filtered.map((category) => (
					<div
						key={category.id}
						id={`categoria-${category.id}`}
						className="scroll-mt-20"
					>
						<h2 className="text-base font-semibold text-foreground">
							{category.name}
						</h2>

						<div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
							{category.tools.map((tool) => (
								<ToolCard key={tool.href} {...tool} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
