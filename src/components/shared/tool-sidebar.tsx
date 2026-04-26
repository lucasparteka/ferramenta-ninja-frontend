import Link from "next/link";
import { findCategoryByToolHref } from "@/lib/data/tools";
import { cn } from "@/lib/utils";

type ToolSidebarProps = {
	currentHref: string;
};

export function ToolSidebar({ currentHref }: ToolSidebarProps) {
	const category = findCategoryByToolHref(currentHref);
	if (!category) return null;

	const others = category.tools;

	return (
		<aside className="lg:sticky lg:top-20 lg:self-start">
			<details
				className="group rounded-lg border border-border bg-card lg:open"
				open
			>
				<summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted lg:cursor-default lg:hover:bg-card [&::-webkit-details-marker]:hidden">
					<span>{category.name}</span>
					<span className="text-xs font-normal text-muted-foreground">
						{others.length} {others.length === 1 ? "ferramenta" : "ferramentas"}
					</span>
				</summary>
				<nav
					aria-label={`Ferramentas da categoria ${category.name}`}
					className="border-t border-border p-2"
				>
					<ul className="flex flex-col gap-0.5">
						{others.map((tool) => {
							const isCurrent = tool.href === currentHref;
							return (
								<li key={tool.href}>
									{isCurrent ? (
										<span
											aria-current="page"
											className="block rounded-sm bg-muted px-3 py-2 text-sm font-medium text-foreground"
										>
											{tool.name}
										</span>
									) : (
										<Link
											href={tool.href}
											className={cn(
												"block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
											)}
										>
											{tool.name}
										</Link>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
				<div className="border-t border-border p-2">
					<Link
						href={`/categorias/${category.id}`}
						className="block rounded-sm px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
					>
						Ver categoria completa →
					</Link>
				</div>
			</details>
		</aside>
	);
}
