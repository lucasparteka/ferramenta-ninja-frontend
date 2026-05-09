"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CharacterCounterStats } from "./character-counter-stats";

type CounterResult = {
	characters: number;
	charactersNoSpaces: number;
	words: number;
	lines: number;
	paragraphs: number;
};

function calculateStats(text: string): CounterResult {
	if (text === "") {
		return {
			characters: 0,
			charactersNoSpaces: 0,
			words: 0,
			lines: 0,
			paragraphs: 0,
		};
	}

	const characters = text.length;
	const charactersNoSpaces = text.replace(/\s/g, "").length;
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const lines = text.split("\n").length;
	const paragraphs = text
		.trim()
		.split(/\n\s*\n/)
		.filter(Boolean).length;

	return { characters, charactersNoSpaces, words, lines, paragraphs };
}

export function CharacterCounter() {
	const [text, setText] = useState("");

	const stats = calculateStats(text);

	return (
		<LayoutD
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">
							Contador de caracteres
						</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							TEMPO REAL
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<CopyButton
							text={text}
							label="Copiar"
							variant="outline"
							size="sm"
							disabled={text === ""}
						/>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Limpar"
							onClick={() => setText("")}
							disabled={text === ""}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</>
			}
			sidebar={<CharacterCounterStats stats={stats} />}
		>
			<label htmlFor="text-input" className="sr-only">
				Texto para análise
			</label>
			<Textarea
				id="text-input"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Digite ou cole seu texto aqui"
				className="flex-1 min-h-70 resize-none bg-transparent border-0 rounded-none p-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-green-600" />
						<span className="text-[11px] text-muted-foreground">
							Em tempo real
						</span>
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-mono text-[11px] text-muted-foreground">
						{stats.characters} caracteres
					</span>
				</div>
			</div>
		</LayoutD>
	);
}
