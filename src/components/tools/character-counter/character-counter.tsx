"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

	function handleCopy() {
		navigator.clipboard.writeText(text);
	}

	return (
		<div className="space-y-6">
			<div>
				<label htmlFor="text-input" className="sr-only">
					Texto para análise
				</label>
				<textarea
					id="text-input"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Digite ou cole seu texto aqui"
					rows={10}
					className="w-full resize-y rounded-lg border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				/>
			</div>

			<CharacterCounterStats stats={stats} />

			<div className="flex gap-3">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setText("")}
					disabled={text === ""}
				>
					Limpar
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleCopy}
					disabled={text === ""}
				>
					Copiar texto
				</Button>
			</div>
		</div>
	);
}
