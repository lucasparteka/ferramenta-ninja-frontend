"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export function CsvJsonInput({ value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<Label>Entrada</Label>
			<Textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="min-h-56 font-mono text-sm"
				placeholder="Cole seu CSV ou JSON aqui..."
			/>
		</div>
	);
}
