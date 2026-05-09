"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Options = {
	removeExtraSpaces: boolean;
	removeLineBreaks: boolean;
	removeInvisible: boolean;
	trimLines: boolean;
};

type Props = {
	options: Options;
	onChange: (options: Options) => void;
};

const items = [
	{ key: "removeExtraSpaces", label: "Remover espaços extras" },
	{ key: "removeLineBreaks", label: "Remover quebras de linha" },
	{ key: "removeInvisible", label: "Remover caracteres invisíveis" },
	{ key: "trimLines", label: "Remover espaços no início/fim das linhas" },
] as const;

export function TextCleanerOptions({ options, onChange }: Props) {
	function handleChange(key: keyof Options, value: boolean) {
		onChange({ ...options, [key]: value });
	}

	return (
		<div className="space-y-3">
			{items.map(({ key, label }) => (
				<div key={key} className="flex items-center justify-between">
					<Label
						htmlFor={key}
						className="cursor-pointer text-xs text-muted-foreground"
					>
						{label}
					</Label>
					<Checkbox
						id={key}
						checked={options[key]}
						onCheckedChange={(v) => handleChange(key, v === true)}
					/>
				</div>
			))}
		</div>
	);
}
