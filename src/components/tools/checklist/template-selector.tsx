"use client";

import type { ChecklistTemplate } from "@/lib/checklist/types";

type TemplateSelectorProps = {
	templates: ChecklistTemplate[];
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
			{templates.map((template) => {
				const isSelected = template.id === selectedId;
				return (
					<button
						key={template.id}
						type="button"
						onClick={() => onSelect(template.id)}
						aria-pressed={isSelected}
						className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							isSelected
								? "border-primary bg-primary text-primary-foreground"
								: "border-border bg-card text-foreground hover:bg-muted"
						}`}
					>
						{template.name}
					</button>
				);
			})}
		</div>
	);
}
