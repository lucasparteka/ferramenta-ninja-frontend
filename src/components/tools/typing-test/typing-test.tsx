"use client";

import { Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutD } from "@/components/shared/layout-d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

	const badgeLabel =
		status === "idle" ? "PRONTO" : status === "running" ? "DIGITANDO" : "CONCLUÍDO";
	const statusLabel =
		status === "idle" ? "Aguardando" : status === "running" ? "Digitando" : "Concluído";

	const stats = [
		{ label: "WPM", value: String(wpm) },
		{ label: "CPM", value: String(cpm) },
		{ label: "Precisão", value: `${accuracy}%` },
		{ label: "Tempo", value: `${elapsed}s / ${duration}s` },
	];

	const durationOptions = [
		{ label: "30s", value: 30 },
		{ label: "1 min", value: 60 },
		{ label: "2 min", value: 120 },
	];

	return (
		<LayoutD
			mainAreaClassName="relative"
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">Teste de Digitação</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							{badgeLabel}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Button
							size="sm"
							variant={status === "running" ? "outline" : "default"}
							onClick={handleRestart}
						>
							{status === "idle" ? (
								<>
									<Play className="mr-1.5 h-3 w-3" />
									Iniciar
								</>
							) : (
								<>
									<RotateCcw className="mr-1.5 h-3 w-3" />
									Reiniciar
								</>
							)}
						</Button>
					</div>
				</>
			}
			sidebar={
				<>
					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Estatísticas
						</h3>
						{stats.map((stat) => (
							<div key={stat.label} className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">{stat.label}</span>
								<span className="font-mono text-xs font-medium tabular-nums">{stat.value}</span>
							</div>
						))}
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Duração
						</h3>
						<div className="flex flex-col gap-1">
							{durationOptions.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => {
										setDuration(opt.value);
										if (status === "idle") setElapsed(0);
									}}
									disabled={status === "running"}
									className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
										duration === opt.value
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{status === "finished" && (
						<div className="p-4 space-y-3">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Resultado
							</h3>
							<div className="rounded border border-border bg-card p-3 text-center">
								<p className="font-mono text-2xl font-semibold tabular-nums">{wpm}</p>
								<p className="text-[11px] text-muted-foreground">WPM</p>
							</div>
							<div className="flex gap-2">
								<div className="flex-1 rounded border border-border bg-card p-2 text-center">
									<p className="font-mono text-sm font-medium tabular-nums">{accuracy}%</p>
									<p className="text-[11px] text-muted-foreground">Precisão</p>
								</div>
								<div className="flex-1 rounded border border-border bg-card p-2 text-center">
									<p className="font-mono text-sm font-medium tabular-nums">{cpm}</p>
									<p className="text-[11px] text-muted-foreground">CPM</p>
								</div>
							</div>
						</div>
					)}
				</>
			}
		>
			<button
				type="button"
				className="flex-1 min-h-[280px] w-full cursor-text p-4 text-left text-base leading-relaxed text-foreground focus:outline-none"
				onClick={handleFocus}
				onKeyDown={() => inputRef.current?.focus()}
			>
				{input && <span className="text-primary">{input}</span>}
				{currentChar && (
					<span
						className={
							input.length > 0 && input[input.length - 1] !== text[input.length - 1]
								? "bg-destructive/20 text-destructive underline"
								: "bg-primary/10 text-primary underline"
						}
					>
						{currentChar}
					</span>
				)}
				{remaining.slice(1) && (
					<span className="text-muted-foreground">{remaining.slice(1)}</span>
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

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
				<span className="inline-flex items-center gap-1.5">
					<span
						className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-green-600" : "bg-foreground/30"}`}
					/>
					<span className="text-[11px] text-muted-foreground">{statusLabel}</span>
				</span>
				<span className="font-mono text-[11px] text-muted-foreground">
					{input.length} / {text.length} chars
				</span>
			</div>
		</LayoutD>
	);
}
