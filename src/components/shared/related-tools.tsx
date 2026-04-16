import Link from "next/link";
import { categories } from "@/lib/data/tools";

const MIN_RELATED = 3;
const MAX_RELATED = 6;

type RelatedToolsProps = {
	currentHref: string;
};

export function RelatedTools({ currentHref }: RelatedToolsProps) {
	const currentCategory = categories.find((cat) =>
		cat.tools.some((t) => t.href === currentHref),
	);

	const sameCategory = (currentCategory?.tools ?? []).filter(
		(t) => t.href !== currentHref,
	);

	const otherTools = categories
		.filter((cat) => cat.id !== currentCategory?.id)
		.flatMap((cat) => cat.tools);

	const related = [...sameCategory, ...otherTools].slice(0, MAX_RELATED);

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
