import Link from "next/link";
import type { LucideIcon } from "@/lib/data/tools";

type Props = {
	name: string;
	href: string;
	description: string;
	icon: LucideIcon | null;
};

export function ToolCard({ name, href, description, icon: Icon }: Props) {
	return (
		<Link
			href={href}
			className="group flex items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-muted"
		>
			<div className="flex h-8 min-w-8 items-center justify-center rounded-sm bg-muted">
				{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
			</div>
			<div className="flex flex-col">
				<span className="text-sm font-medium text-foreground">{name}</span>
				<span className="text-xs text-muted-foreground line-clamp-2">
					{description}
				</span>
			</div>
		</Link>
	);
}
