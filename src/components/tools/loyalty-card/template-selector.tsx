"use client";

import { cn } from "@/lib/utils";
import type { Template } from "./types";

type TemplateSelectorProps = {
	templates: Template[];
	selectedId: string;
	onSelect: (id: string) => void;
};

export function TemplateSelector({
	templates,
	selectedId,
	onSelect,
}: TemplateSelectorProps) {
	return (
		<div className="flex gap-3 overflow-x-auto pb-2">
			{templates.map((template) => {
				const isSelected = template.id === selectedId;
				return (
					<button
						key={template.id}
						type="button"
						onClick={() => onSelect(template.id)}
						aria-pressed={isSelected}
						className={cn(
							"rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
							isSelected
								? "border-primary bg-primary text-white"
								: "border-border bg-background text-foreground hover:border-primary",
						)}
					>
						{template.name}
					</button>
				);
			})}
		</div>
	);
}
