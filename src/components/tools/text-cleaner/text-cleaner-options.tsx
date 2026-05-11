"use client";

import { SwitchRow } from "@/components/shared/switch-row";
import type { TextCleanerOptions as TextCleanerOptionsType } from "./use-text-cleaner";

type OptionDef = {
	key: keyof TextCleanerOptionsType;
	label: string;
	hint: string;
};

type Props = {
	options: TextCleanerOptionsType;
	onChange: (options: TextCleanerOptionsType) => void;
	counts?: Partial<Record<keyof TextCleanerOptionsType, number>>;
};

const items: OptionDef[] = [
	{ key: "removeExtraSpaces", label: "Espaços extras", hint: "Reduz múltiplos espaços para um" },
	{ key: "removeLineBreaks", label: "Quebras de linha duplicadas", hint: "Reduz múltiplas quebras para uma" },
	{ key: "removeInvisible", label: "Caracteres invisíveis", hint: "Remove zero-width, BOM, etc." },
	{ key: "trimLines", label: "Trim por linha", hint: "Espaços no início/fim de cada linha" },
];

export function TextCleanerOptions({ options, onChange, counts }: Props) {
	function handleChange(key: keyof TextCleanerOptionsType, value: boolean) {
		onChange({ ...options, [key]: value });
	}

	return (
		<div className="space-y-2">
			{items.map(({ key, label, hint }) => {
				const count = counts?.[key];
				const feedback = count !== undefined && count > 0 ? `−${count} ocorrências` : undefined;
				return (
					<SwitchRow
						key={key}
						label={label}
						hint={hint}
						checked={options[key]}
						onChange={(v) => handleChange(key, v)}
						feedback={feedback}
						muted={!options[key]}
					/>
				);
			})}
		</div>
	);
}
