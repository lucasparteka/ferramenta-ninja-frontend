"use client";

import { ArrowLeftRight, FileUp, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { OptionSwitch } from "@/components/shared/option-switch";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar, StatusDot } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { decodeBase64, encodeBase64 } from "@/lib/encoding/base64";
import { cn } from "@/lib/utils";

type Mode = "encode" | "decode";
type Variant = "standard" | "urlsafe";

export function Base64Tool() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("encode");
	const [variant, setVariant] = useState<Variant>("standard");

	const result = useMemo(() => {
		if (!input.trim()) return { output: "", error: null, timeMs: 0 };
		const start = performance.now();
		try {
			const fn = mode === "encode" ? encodeBase64 : decodeBase64;
			const output = fn(input);
			return {
				output,
				error: null,
				timeMs: performance.now() - start,
			};
		} catch (e) {
			return {
				output: "",
				error: e instanceof Error ? e.message : "Erro desconhecido.",
				timeMs: 0,
			};
		}
	}, [input, mode, variant]);

	function handleSwap() {
		if (result.output) {
			setInput(result.output);
			setMode(mode === "encode" ? "decode" : "encode");
		}
	}

	function handleClear() {
		setInput("");
	}

	const inputLen = input.length;
	const outputLen = result.output.length;
	const inputBytes = new TextEncoder().encode(input).length;
	const outputBytes = result.output.length;
	const ratio =
		inputLen > 0 && outputLen > 0
			? ((outputLen / inputLen) * 100).toFixed(0)
			: null;

	const checksum = useMemo(() => {
		if (!result.output) return "";
		let hash = 0;
		for (let i = 0; i < result.output.length; i++) {
			const chr = result.output.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0;
		}
		return Math.abs(hash).toString(16).slice(0, 4);
	}, [result.output]);

	return (
		<LayoutC
			toolbar={
				<>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Direção
							</span>
							<OptionSwitch
								options={[
									{ label: "Codificar", value: "encode" },
									{ label: "Decodificar", value: "decode" },
								]}
								value={mode}
								onChange={(v) => setMode(v as Mode)}
								size="sm"
							/>
						</div>
						<div className="h-4 w-px bg-border" />
						<div className="flex items-center gap-2">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Variante
							</span>
							<OptionSwitch
								options={[
									{ label: "Padrão", value: "standard" },
									{ label: "URL-safe", value: "urlsafe" },
								]}
								value={variant}
								onChange={(v) => setVariant(v as Variant)}
								size="sm"
							/>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-mono text-[11px] text-muted-foreground">
							UTF-8
						</span>
					</div>
				</>
			}
			left={
				<>
					<PaneHeader
						title="Entrada · Texto"
						actions={
							<>
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Carregar arquivo"
								>
									<FileUp className="h-3.5 w-3.5" />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={handleClear}
									disabled={!input}
									aria-label="Limpar"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							</>
						}
					/>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "encode"
								? "Digite o texto aqui..."
								: "Cole o Base64 aqui..."
						}
						className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						spellCheck={false}
					/>
				</>
			}
			right={
				<>
					<PaneHeader
						title={
							<>
								Saída · Base64
								{result.output && (
									<span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success">
										Pronto
									</span>
								)}
							</>
						}
						actions={
							<>
								<CopyButton
									text={result.output}
									disabled={!result.output}
									variant="ghost"
									size="icon-sm"
									iconOnly
								/>
							</>
						}
					/>
					<div className="flex-1 min-h-[280px] bg-muted/20 p-3">
						{result.error ? (
							<p className="text-xs text-destructive">{result.error}</p>
						) : result.output ? (
							<pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all select-all">
								{result.output}
							</pre>
						) : (
							<p className="text-sm text-muted-foreground">
								{input ? "Processando..." : "Aguardando entrada"}
							</p>
						)}
					</div>
				</>
			}
			swapButton={
				<button
					type="button"
					onClick={handleSwap}
					disabled={!result.output}
					className={cn(
						"rounded-full border border-border bg-card p-1.5 text-muted-foreground transition-colors shadow-sm",
						result.output
							? "hover:text-foreground hover:bg-muted"
							: "opacity-40 pointer-events-none",
					)}
					aria-label="Inverter entrada e saída"
				>
					<ArrowLeftRight className="h-3.5 w-3.5" />
				</button>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: input
								? `Codificado em ${result.timeMs.toFixed(1)}ms`
								: "Aguardando",
							mono: true,
						},
						{
							label: "Entrada",
							value: inputLen
								? `${inputLen} chars · ${inputBytes} bytes`
								: "0",
							mono: true,
						},
						{
							label: "Saída",
							value: outputLen
								? `${outputLen} chars${ratio ? ` · +${ratio}%` : ""}`
								: "0",
							mono: true,
						},
						{
							label: "cs",
							value: checksum || "—",
							mono: true,
						},
					]}
					right={
						<span className="font-mono text-[11px] text-muted-foreground">
							RFC 4648{variant === "urlsafe" ? " · URL-safe" : ""}
						</span>
					}
				/>
			}
		/>
	);
}
