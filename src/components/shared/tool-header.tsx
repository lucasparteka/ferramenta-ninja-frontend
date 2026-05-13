import type { ReactNode } from "react";

type ToolHeaderProps = {
	title: string;
	badge?: ReactNode;
	actions?: ReactNode;
};

export function ToolHeader({ title, badge, actions }: ToolHeaderProps) {
	return (
		<>
			<div className="flex items-center gap-3">
				<h1 className="text-sm font-semibold tracking-tight">{title}</h1>
				{badge && (
					<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
						{badge}
					</span>
				)}
			</div>
			{actions && (
				<div className="flex items-center gap-1.5">{actions}</div>
			)}
		</>
	);
}
