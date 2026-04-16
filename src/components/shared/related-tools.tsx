import Link from "next/link";
import { categories, type Tool } from "@/lib/data/tools";

const MIN_RELATED = 3;
const MAX_RELATED = 6;

type RelatedToolsProps = {
	currentHref: string;
	customTools?: Omit<Tool, "icon">[];
};

function getScore(current: Tool, candidate: Tool, isSameCategory: boolean) {
	let score = 0;

	// 1. Tags em comum (peso alto)
	const commonTags =
		current.tags?.filter((tag) => candidate.tags?.includes(tag)) ?? [];

	score += commonTags.length * 3;

	// 2. Intent igual (peso médio)
	if (current.intent && current.intent === candidate.intent) {
		score += 2;
	}

	// 3. Mesma categoria (peso leve)
	if (isSameCategory) {
		score += 1;
	}

	// 4. Boost manual
	score += candidate.weight ?? 0;

	return score;
}

function getRelatedTools(currentHref: string): Tool[] {
	const allTools = categories.flatMap((c) => c.tools);

	const current = allTools.find((t) => t.href === currentHref);
	if (!current) return [];

	const currentCategory = categories.find((cat) =>
		cat.tools.some((t) => t.href === currentHref),
	);

	const scored = allTools
		.filter((t) => t.href !== currentHref)
		.map((tool) => {
			const isSameCategory = currentCategory?.tools.some(
				(t) => t.href === tool.href,
			);

			return {
				tool,
				score: getScore(current, tool, !!isSameCategory),
			};
		})
		.sort((a, b) => b.score - a.score);

	return scored.slice(0, MAX_RELATED).map((s) => s.tool);
}

export function RelatedTools({ currentHref, customTools }: RelatedToolsProps) {
	const related = customTools ?? getRelatedTools(currentHref);

	if (related.length < MIN_RELATED) return null;

	return (
		<section>
			<h2 className="mb-4 text-xl font-bold text-foreground">Veja também</h2>

			<ul className="flex flex-col gap-2">
				{related.map((tool) => (
					<li key={tool.href}>
						<Link
							href={tool.href}
							className="text-[#0000FF] underline-offset-3 underline"
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
	);
}
