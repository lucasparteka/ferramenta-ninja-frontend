"use client";

import { Plus, Trash } from "lucide-react";
import { type Control, useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { ResumeFormValues } from "./types";

const LANGUAGE_LEVELS = [
	"Básico",
	"Intermediário",
	"Avançado",
	"Fluente",
	"Nativo",
];

function LanguageRow({
	index,
	control,
	onRemove,
}: {
	index: number;
	control: Control<ResumeFormValues>;
	onRemove: () => void;
}) {
	return (
		<div className="flex gap-3 items-start">
			<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
				<FormField
					control={control}
					name={`languages.${index}.name`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Idioma</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Inglês" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name={`languages.${index}.level`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Nível</FormLabel>
							<FormControl>
								<NativeSelect {...field}>
									<option value="" disabled>
										Nível
									</option>
									{LANGUAGE_LEVELS.map((level) => (
										<option key={level} value={level}>
											{level}
										</option>
									))}
								</NativeSelect>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<Button
				type="button"
				variant="secondary"
				className="shrink-0"
				onClick={onRemove}
			>
				<Trash />
			</Button>
		</div>
	);
}

export function LanguagesSection() {
	const { control, setValue, clearErrors } = useFormContext<ResumeFormValues>();
	const languages = useWatch({ control, name: "languages" }) ?? [];

	const addLanguage = () =>
		setValue(
			"languages",
			[...languages, { id: crypto.randomUUID(), name: "", level: "" }],
			{ shouldDirty: true },
		);

	const removeLanguage = (id: string) => {
		setValue(
			"languages",
			languages.filter((l) => l.id !== id),
			{ shouldDirty: true },
		);
		clearErrors("languages");
	};

	return (
		<div className="space-y-3">
			{languages.map((lang, index) => (
				<LanguageRow
					key={lang.id}
					index={index}
					control={control}
					onRemove={() => removeLanguage(lang.id)}
				/>
			))}

			{languages.length === 0 && (
				<p className="text-sm text-muted-foreground">
					Nenhum idioma adicionado.
				</p>
			)}

			<Button type="button" variant="link" onClick={addLanguage}>
				<Plus size={16} />
				Adicionar Idioma
			</Button>
		</div>
	);
}
