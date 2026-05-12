"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";

type OcrLanguage = "por" | "eng" | "spa";

type OcrControlsProps = {
	language: OcrLanguage;
	disabled: boolean;
	onLanguageChange: (language: OcrLanguage) => void;
	onExtract: () => void;
};

const LANGUAGE_OPTIONS: { value: OcrLanguage; label: string }[] = [
	{ value: "por", label: "Português" },
	{ value: "eng", label: "Inglês" },
	{ value: "spa", label: "Espanhol" },
];

export function OcrControls({
	language,
	disabled,
	onLanguageChange,
	onExtract,
}: OcrControlsProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="ocr-language" className="block">
					Idioma do texto
				</Label>
				<NativeSelect
					id="ocr-language"
					value={language}
					onChange={(e) => onLanguageChange(e.target.value as OcrLanguage)}
					disabled={disabled}
					className="disabled:cursor-not-allowed disabled:opacity-50"
				>
					{LANGUAGE_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</NativeSelect>
			</div>
			<Button className="w-full" disabled={disabled} onClick={onExtract}>
				Extrair texto
			</Button>
		</div>
	);
}
