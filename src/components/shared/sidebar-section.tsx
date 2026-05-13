import type { ReactNode } from "react";

type SidebarSectionProps = {
	title: string;
	hint?: string;
	children: ReactNode;
};

export function SidebarSection({ title, hint, children }: SidebarSectionProps) {
	return (
		<div className="p-4 space-y-2">
			<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
				{title}
				{hint && (
					<span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground/60">
						{hint}
					</span>
				)}
			</h3>
			{children}
		</div>
	);
}
