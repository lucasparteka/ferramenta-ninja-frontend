"use client";

import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DEFAULT_FLAGS,
	FLAG_DESCRIPTIONS,
	getHighlightRanges,
	type HighlightRange,
	QUICK_REFERENCE,
	type RegexFlags,
	testRegex,
} from "@/lib/regex/regex-tester";
import { cn } from "@/lib/utils";

function HighlightedText({
	text,
	ranges,
}: {
	text: string;
	ranges: HighlightRange[];
}) {
	if (!text) {
		return <span className="text-muted-foreground">insira seu texto aqui</span>;
	}

	if (ranges.length === 0) {
		return <span>{text}</span>;
	}

	const parts: React.ReactNode[] = [];
	let lastIndex = 0;

	for (const range of ranges) {
		if (range.start > lastIndex) {
			parts.push(
				<span key={`t-${lastIndex}`}>
					{text.slice(lastIndex, range.start)}
				</span>,
			);
		}
		parts.push(
			<mark
				key={`m-${range.matchIndex}`}
				className="bg-primary/25 text-foreground not-italic rounded-[2px]"
			>
				{text.slice(range.start, range.end)}
			</mark>,
		);
		lastIndex = range.end;
	}

	if (lastIndex < text.length) {
		parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
	}

	return <>{parts}</>;
}

export function RegexTester() {
	const [pattern, setPattern] = useState("");
	const [flags, setFlags] = useState<RegexFlags>(DEFAULT_FLAGS);
	const [testString, setTestString] = useState("");
	const [refOpen, setRefOpen] = useState(false);

	const divRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const result = useMemo(
		() => testRegex(pattern, flags, testString),
		[pattern, flags, testString],
	);

	const ranges = useMemo(
		() => getHighlightRanges(result.matches),
		[result.matches],
	);

	const flagStr = result.flags;
	const patternDisplay = pattern ? `/${pattern}/${flagStr}` : "";

	function toggleFlag(key: keyof RegexFlags) {
		setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
	}

	function handleScroll(e: React.UIEvent<HTMLTextAreaElement>) {
		if (divRef.current) {
			divRef.current.scrollTop = e.currentTarget.scrollTop;
			divRef.current.scrollLeft = e.currentTarget.scrollLeft;
		}
	}

	function clearAll() {
		setPattern("");
		setTestString("");
		setFlags(DEFAULT_FLAGS);
	}

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-2">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Flags
						</h3>
						<div className="space-y-1.5">
							{(Object.keys(DEFAULT_FLAGS) as Array<keyof RegexFlags>).map(
								(key) => {
									const { label, description } = FLAG_DESCRIPTIONS[key];
									return (
										<div key={key} className="flex items-center gap-2">
											<Checkbox
												id={`flag-${key}`}
												checked={flags[key]}
												onCheckedChange={() => toggleFlag(key)}
											/>
											<Label
												htmlFor={`flag-${key}`}
												className="cursor-pointer gap-1.5"
											>
												<span className="font-mono text-sm text-foreground">
													{label}
												</span>
												<span className="text-sm text-muted-foreground font-normal">
													{description}
												</span>
											</Label>
										</div>
									);
								},
							)}
						</div>
					</div>

					<div className="p-4">
						<button
							type="button"
							onClick={() => setRefOpen((v) => !v)}
							className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
							aria-expanded={refOpen}
						>
							Referência rápida
							{refOpen ? (
								<ChevronDown className="h-3.5 w-3.5" />
							) : (
								<ChevronRight className="h-3.5 w-3.5" />
							)}
						</button>

						{refOpen && (
							<div className="mt-3 space-y-1">
								{QUICK_REFERENCE.map(({ token, meaning }) => (
									<div
										key={token}
										className="flex items-start gap-2 text-[11px]"
									>
										<code className="shrink-0 w-20 font-mono text-primary">
											{token}
										</code>
										<span className="text-muted-foreground leading-tight">
											{meaning}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col h-full">
					<div className="px-4 py-3 border-b border-border bg-card space-y-2">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Padrão
						</h3>
						<Input
							type="text"
							value={pattern}
							onChange={(e) => setPattern(e.target.value)}
							placeholder="sua expressão regular aqui"
							className="font-mono"
							aria-label="Expressão regular"
							aria-describedby="pattern-status"
							spellCheck={false}
						/>
						<div id="pattern-status" aria-live="polite">
							{pattern && (
								<span
									className={cn(
										"inline-block rounded px-1.5 py-px font-mono text-[10px]",
										result.valid
											? "bg-success/10 text-success border border-success/20"
											: "bg-destructive/10 text-destructive border border-destructive/20",
									)}
								>
									{result.valid
										? `✓ válido · /${pattern}/${flagStr}`
										: `✗ ${result.error}`}
								</span>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Texto de teste
						</h3>
						<div className="flex items-center gap-2">
							{result.totalMatches > 0 && (
								<span
									aria-live="polite"
									className="rounded border border-success/30 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success"
								>
									{result.totalMatches} match
									{result.totalMatches !== 1 ? "es" : ""}
								</span>
							)}
							{pattern && !result.valid && (
								<span className="rounded border border-destructive/30 bg-destructive/10 px-1.5 py-px font-mono text-[10px] text-destructive">
									inválido
								</span>
							)}
							{pattern &&
								result.valid &&
								result.totalMatches === 0 &&
								testString && (
									<span className="rounded border border-border bg-muted/40 px-1.5 py-px font-mono text-[10px] text-muted-foreground">
										sem matches
									</span>
								)}
							<Button
								variant="ghost"
								size="sm"
								onClick={clearAll}
								className="h-6 text-[11px] text-muted-foreground hover:text-foreground px-2"
							>
								<RotateCcw className="h-3 w-3 mr-1" />
								Limpar
							</Button>
						</div>
					</div>

					<div className="flex-1 relative overflow-hidden">
						<div
							ref={divRef}
							aria-hidden="true"
							className="absolute inset-0 overflow-hidden pointer-events-none p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground"
						>
							<HighlightedText text={testString} ranges={ranges} />
						</div>
						<textarea
							ref={textareaRef}
							value={testString}
							onChange={(e) => setTestString(e.target.value)}
							onScroll={handleScroll}
							className="absolute inset-0 w-full h-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-transparent outline-none border-0 focus:ring-0 overflow-auto placeholder:text-muted-foreground"
							style={{ caretColor: "var(--foreground)" }}
							spellCheck={false}
						/>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Resultados
							</h3>
							{patternDisplay && <CopyButton text={patternDisplay} size="xs" />}
						</div>

						{!pattern && (
							<p className="text-xs text-muted-foreground">
								Digite um padrão para ver os matches.
							</p>
						)}

						{pattern && !result.valid && (
							<div
								role="alert"
								className="rounded-md bg-destructive/10 border border-destructive/20 p-2"
							>
								<p className="text-xs text-destructive font-mono">
									{result.error}
								</p>
							</div>
						)}

						{result.valid &&
							result.totalMatches === 0 &&
							pattern &&
							testString && (
								<p className="text-xs text-muted-foreground">
									Nenhum match encontrado.
								</p>
							)}

						{result.matches.length > 0 && (
							<div className="space-y-0 divide-y divide-border max-h-75 overflow-y-auto rounded-md border border-border">
								{result.matches.map((match, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: static list
									<div key={i} className="p-2 space-y-0.5">
										<div className="flex items-center justify-between gap-1">
											<span className="text-[10px] text-muted-foreground">
												Match {i + 1}
											</span>
											<span className="font-mono text-[10px] text-muted-foreground">
												idx: {match.index} · len: {match.length}
											</span>
										</div>
										<p
											className="font-mono text-xs text-foreground truncate"
											title={match.fullMatch}
										>
											&ldquo;{match.fullMatch}&rdquo;
										</p>
										{match.captures.length > 0 && (
											<div className="space-y-0.5 pt-0.5">
												{match.captures.map((cap, ci) => (
													// biome-ignore lint/suspicious/noArrayIndexKey: static list
													<div key={ci} className="flex gap-1 items-start">
														<span className="font-mono text-[10px] text-muted-foreground shrink-0">
															#{ci + 1}
														</span>
														<span className="font-mono text-[10px] text-foreground truncate">
															{cap || "(vazio)"}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{result.matches.some((m) => Object.keys(m.groups).length > 0) && (
						<div className="p-4 space-y-2">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Grupos nomeados
							</h3>
							{result.matches.map((match, i) =>
								Object.keys(match.groups).length > 0 ? (
									// biome-ignore lint/suspicious/noArrayIndexKey: static list
									<div key={i} className="space-y-1">
										<span className="text-[10px] text-muted-foreground">
											Match {i + 1}
										</span>
										{Object.entries(match.groups).map(([name, value]) => (
											<div key={name} className="flex gap-2 items-start">
												<code className="font-mono text-[10px] text-primary shrink-0">
													{name}
												</code>
												<span className="font-mono text-[10px] text-foreground truncate">
													{value}
												</span>
											</div>
										))}
									</div>
								) : null,
							)}
						</div>
					)}

					{patternDisplay && (
						<div className="p-4 space-y-2">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Expressão
							</h3>
							<div className="flex items-center gap-2">
								<code className="flex-1 font-mono text-xs text-foreground bg-muted/20 px-2 py-1 rounded border border-border overflow-x-auto whitespace-nowrap">
									{patternDisplay}
								</code>
								<CopyButton text={patternDisplay} size="xs" />
							</div>
						</div>
					)}
				</div>
			}
		/>
	);
}
