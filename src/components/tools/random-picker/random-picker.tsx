"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { drawRandomItems } from "@/lib/random/draw";
import { RandomPickerInput } from "./input";
import { RandomPickerOptions } from "./options";
import { RandomPickerResult } from "./result";

type PickerOptions = {
	winnersCount: number;
	allowRepeat: boolean;
	removeEmpty: boolean;
};

const DEFAULT_OPTIONS: PickerOptions = {
	winnersCount: 1,
	allowRepeat: false,
	removeEmpty: true,
};

function parseItems(input: string, removeEmpty: boolean): string[] {
	return input
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => !removeEmpty || line !== "");
}

export function RandomPicker() {
	const [input, setInput] = useState("");
	const [options, setOptions] = useState<PickerOptions>(DEFAULT_OPTIONS);
	const [winners, setWinners] = useState<string[] | null>(null);
	const [drawing, setDrawing] = useState(false);
	const [error, setError] = useState("");

	const items = parseItems(input, options.removeEmpty);
	const maxWinners = options.allowRepeat ? 50 : Math.max(1, items.length);

	function handleInput(value: string) {
		setInput(value);
		setWinners(null);
		setError("");
	}

	function handleDraw() {
		if (items.length === 0) {
			setError("Adicione pelo menos um item para sortear.");
			return;
		}

		setError("");
		setWinners(null);
		setDrawing(true);

		setTimeout(() => {
			const result = drawRandomItems(items, {
				winnersCount: options.winnersCount,
				allowRepeat: options.allowRepeat,
			});
			setWinners(result);
			setDrawing(false);
		}, 400);
	}

	return (
		<div className="space-y-6">
			<RandomPickerInput
				value={input}
				onChange={handleInput}
				itemCount={items.length}
			/>
			<RandomPickerOptions
				options={options}
				maxWinners={maxWinners}
				onChange={setOptions}
			/>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<div className="flex gap-3">
				<Button onClick={handleDraw} disabled={drawing}>
					{drawing ? "Sorteando..." : "Sortear"}
				</Button>
				{winners && (
					<Button variant="outline" onClick={handleDraw} disabled={drawing}>
						Sortear novamente
					</Button>
				)}
			</div>

			{winners && <RandomPickerResult winners={winners} />}
		</div>
	);
}
