"use client";

import { Plus, Trash2 } from "lucide-react";
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

const PLATFORMS = [
	"LinkedIn",
	"GitHub",
	"Portfolio",
	"Behance",
	"Dribbble",
	"Twitter / X",
	"YouTube",
	"Instagram",
	"Outro",
];

function SocialLinkRow({
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
			<div className="flex-1 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
				<FormField
					control={control}
					name={`socialLinks.${index}.platform`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Plataforma</FormLabel>
							<FormControl>
								<NativeSelect {...field}>
									<option value="" disabled>
										Plataforma
									</option>
									{PLATFORMS.map((p) => (
										<option key={p} value={p}>
											{p}
										</option>
									))}
								</NativeSelect>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name={`socialLinks.${index}.url`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">URL</FormLabel>
							<FormControl>
								<Input placeholder="https://..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="mt-1.5 text-destructive hover:text-destructive shrink-0"
				onClick={onRemove}
			>
				<Trash2 size={16} />
			</Button>
		</div>
	);
}

export function SocialLinksSection() {
	const { control, setValue, clearErrors } = useFormContext<ResumeFormValues>();
	const socialLinks = useWatch({ control, name: "socialLinks" }) ?? [];

	const addSocialLink = () =>
		setValue(
			"socialLinks",
			[...socialLinks, { id: crypto.randomUUID(), platform: "", url: "" }],
			{ shouldDirty: true },
		);

	const removeSocialLink = (id: string) => {
		setValue(
			"socialLinks",
			socialLinks.filter((l) => l.id !== id),
			{ shouldDirty: true },
		);
		clearErrors("socialLinks");
	};

	return (
		<div className="space-y-3">
			{socialLinks.map((link, index) => (
				<SocialLinkRow
					key={link.id}
					index={index}
					control={control}
					onRemove={() => removeSocialLink(link.id)}
				/>
			))}

			{socialLinks.length === 0 && (
				<p className="text-sm text-muted-foreground">Nenhum link adicionado.</p>
			)}

			<Button type="button" variant="link" onClick={addSocialLink}>
				<Plus size={16} />
				Adicionar Link
			</Button>
		</div>
	);
}
