"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export function TextCleanerInput({ value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<Label>Texto</Label>
			<Textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Cole seu texto aqui..."
				className="min-h-48 font-mono text-sm"
			/>
		</div>
	);
}
