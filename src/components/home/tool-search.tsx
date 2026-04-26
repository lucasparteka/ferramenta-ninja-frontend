"use client";

import { useMemo, useState } from "react";
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
		<div className="flex flex-col gap-8">
			<input
				type="text"
				placeholder="Buscar ferramenta..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="w-full rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-primary bg-white"
			/>

			<div className="space-y-12">
				{filtered.map((category) => (
					<div
						key={category.id}
						id={`categoria-${category.id}`}
						className="scroll-mt-20"
					>
						<h2 className="text-xl font-semibold">{category.name}</h2>

						<div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
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
