"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	ResultBox,
	ResultGrid,
	ResultRow,
} from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import {
	calculateAccuracy,
	calculateCPM,
	calculateWPM,
	getRandomSampleText,
	SAMPLE_TEXTS,
} from "@/lib/text/typing-test";

export function TypingTest() {
	const [text, setText] = useState(SAMPLE_TEXTS[0]);
	const [input, setInput] = useState("");
	const [status, setStatus] = useState<"idle" | "running" | "finished">("idle");
	const [duration, setDuration] = useState(60);
	const [elapsed, setElapsed] = useState(0);
	const [correctChars, setCorrectChars] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setText(getRandomSampleText());
	}, []);

	const wpm = calculateWPM(correctChars, elapsed);
	const cpm = calculateCPM(correctChars, elapsed);
	const accuracy = calculateAccuracy(correctChars, input.length);

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const startTimer = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		const start = Date.now();
		intervalRef.current = setInterval(() => {
			const sec = Math.floor((Date.now() - start) / 1000);
			setElapsed(sec);
			if (sec >= duration) {
				if (intervalRef.current) clearInterval(intervalRef.current);
				setStatus("finished");
			}
		}, 500);
	}, [duration]);

	function handleInputChange(value: string) {
		if (status === "finished") return;

		if (status === "idle" && value.length > 0) {
			setStatus("running");
			startTimer();
		}

		const newValue = value.slice(0, text.length);
		setInput(newValue);

		let correct = 0;
		for (let i = 0; i < newValue.length; i++) {
			if (newValue[i] === text[i]) correct++;
		}
		setCorrectChars(correct);

		if (newValue.length >= text.length) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			setStatus("finished");
		}
	}

	function handleRestart() {
		if (intervalRef.current) clearInterval(intervalRef.current);
		setText(getRandomSampleText());
		setInput("");
		setStatus("idle");
		setElapsed(0);
		setCorrectChars(0);
		inputRef.current?.focus();
	}

	function handleFocus() {
		inputRef.current?.focus();
	}

	const remaining = text.slice(input.length);
	const currentChar = text[input.length] ?? "";
	const typed = input;

	return (
		<div className="space-y-6">
			<div className="max-w-2xl space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="typing-duration"
						className="block text-sm font-medium text-foreground"
					>
						Duração
					</label>
					<NativeSelect
						id="typing-duration"
						value={String(duration)}
						onChange={(e) => {
							const val = Number(e.target.value);
							setDuration(val);
							if (status === "idle") setElapsed(0);
						}}
						disabled={status === "running"}
					>
						<option value="30">30 segundos</option>
						<option value="60">1 minuto</option>
						<option value="120">2 minutos</option>
					</NativeSelect>
				</div>

				<div className="space-y-2">
					<p className="text-sm font-medium text-foreground">
						Texto para digitar
					</p>
					<button
						type="button"
						className="min-h-[120px] w-full rounded-lg border border-border bg-card p-4 text-left text-lg leading-relaxed text-foreground"
						onClick={handleFocus}
						onKeyDown={() => inputRef.current?.focus()}
					>
						{typed && <span className="text-primary">{typed}</span>}
						{currentChar && (
							<span
								className={
									input.length > 0 &&
									input[input.length - 1] !== text[input.length - 1]
										? "bg-destructive/20 text-destructive underline"
										: "bg-primary/10 text-primary underline"
								}
							>
								{currentChar}
							</span>
						)}
						{remaining.slice(1) && (
							<span className="text-muted-foreground">
								{remaining.slice(1)}
							</span>
						)}
					</button>
					<Input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => handleInputChange(e.target.value)}
						className="absolute h-0 w-0 opacity-0"
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck={false}
						disabled={status === "finished"}
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						onClick={handleRestart}
						variant={status === "running" ? "outline" : "default"}
					>
						{status === "idle" ? "Iniciar" : "Reiniciar"}
					</Button>
				</div>
			</div>

			{(status === "running" || status === "finished") && (
				<div className="max-w-2xl space-y-4">
					<ResultGrid>
						<ResultRow label="Tempo" value={`${elapsed}s / ${duration}s`} />
						<ResultRow
							label="Precisão"
							value={<span className="text-primary">{accuracy}%</span>}
						/>
						<ResultRow
							label="WPM"
							value={<span className="text-primary">{wpm}</span>}
						/>
						<ResultRow
							label="CPM"
							value={<span className="text-primary">{cpm}</span>}
						/>
					</ResultGrid>

					{status === "finished" && (
						<ResultBox tone="primary">
							<p className="text-3xl font-bold">{wpm} WPM</p>
							<p className="mt-1 text-sm">
								{accuracy}% de precisão · {cpm} CPM · {elapsed}s
							</p>
						</ResultBox>
					)}
				</div>
			)}
		</div>
	);
}
