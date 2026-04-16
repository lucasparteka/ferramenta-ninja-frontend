import type { MenuTemplate } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

type TemplateSelectorProps = {
	templates: MenuTemplate[];
	selectedId: string;
	onSelect: (id: string) => void;
};

export function TemplateSelector({
	templates,
	selectedId,
	onSelect,
}: TemplateSelectorProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{templates.map((t) => (
				<button
					key={t.id}
					type="button"
					onClick={() => onSelect(t.id)}
					className={cn(
						"rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
						selectedId === t.id
							? "border-primary bg-primary text-primary-foreground"
							: "border-border bg-background text-foreground hover:border-primary",
					)}
				>
					{t.name}
				</button>
			))}
		</div>
	);
}
