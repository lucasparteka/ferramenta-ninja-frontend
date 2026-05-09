import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { findCategoryByToolHref } from "@/lib/data/tools";
import { cn } from "@/lib/utils";

type CategoryToolsSectionProps = {
	currentHref: string;
};

export function CategoryToolsSection({
	currentHref,
}: CategoryToolsSectionProps) {
	const category = findCategoryByToolHref(currentHref);
	if (!category) return null;

	const others = category.tools;

	return (
		<section className="mt-12 lg:mt-16">
			<div className="mb-4 flex justify-between max-md:flex-col">
				<h2 className="text-base font-semibold">
					Ferramentas da categoria {category.name}
				</h2>
				<Link
					href={`/categorias/${category.id}`}
					className="flex items-center text-sm text-foreground transition-colors hover:text-primary max-md:my-2"
				>
					Ver categoria completa
					<ArrowRight className="ml-1 h-3 w-3" />
				</Link>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{others.map((tool) => {
					const isCurrent = tool.href === currentHref;
					return (
						<div
							key={tool.href}
							className={cn(
								"rounded-sm border p-3 transition-colors",
								isCurrent
									? "border-foreground/30 bg-muted"
									: "border-border bg-card hover:bg-muted",
							)}
						>
							{isCurrent ? (
								<div className="flex items-start gap-2">
									<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
									<div>
										<p className="text-sm font-semibold text-foreground">
											{tool.name}
										</p>
										<p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
											{tool.description}
										</p>
									</div>
								</div>
							) : (
								<Link href={tool.href} className="flex items-start gap-2">
									<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
									<div>
										<p className="text-sm font-semibold text-foreground">
											{tool.name}
										</p>
										<p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
											{tool.description}
										</p>
									</div>
								</Link>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}
