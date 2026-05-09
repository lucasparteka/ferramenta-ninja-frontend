"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { Button } from "@/components/ui/button";
import { binaryToText, textToBinary } from "@/lib/encoding/binary";

type Mode = "encode" | "decode";

export function BinaryConverter() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("encode");
	const [separator, setSeparator] = useState(" ");

	const result = useMemo(() => {
		if (!input.trim()) return { output: "", error: null };
		try {
			const output =
				mode === "encode"
					? textToBinary(input.trim(), separator)
					: binaryToText(input);
			return { output, error: null };
		} catch (e) {
			return {
				output: "",
				error: e instanceof Error ? e.message : "Erro desconhecido.",
			};
		}
	}, [input, mode, separator]);

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

	return (
		<LayoutC
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<div className="flex items-center gap-1">
							{(["encode", "decode"] as const).map((m) => (
								<button
									key={m}
									type="button"
									onClick={() => setMode(m)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										mode === m
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{m === "encode" ? "Texto → Bin" : "Bin → Texto"}
								</button>
							))}
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleSwap}
								disabled={!result.output}
								aria-label="Trocar entrada e saída"
							>
								<ArrowLeftRight className="h-3.5 w-3.5" />
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
						</div>
					</div>

					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "encode"
								? "Digite o texto aqui..."
								: "Cole o código binário aqui..."
						}
						className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						spellCheck={false}
					/>

					{mode === "encode" && (
						<div className="flex items-center justify-between border-t border-border px-3 py-2">
							<span className="text-[11px] text-muted-foreground">
								Separador
							</span>
							<div className="flex items-center gap-1">
								{[
									{ label: "Espaço", value: " " },
									{ label: "Nenhum", value: "" },
								].map((opt) => (
									<button
										key={opt.label}
										type="button"
										onClick={() => setSeparator(opt.value)}
										className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
											separator === opt.value
												? "bg-foreground/10 font-medium text-foreground"
												: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
										}`}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>
					)}
				</>
			}
			right={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Saída
						</span>
						<CopyButton
							text={result.output}
							disabled={!result.output}
							variant="ghost"
							size="icon-sm"
							iconOnly
						/>
					</div>

					<div className="flex-1 min-h-[280px] bg-muted/20 p-3">
						{result.error ? (
							<p className="text-xs text-destructive">{result.error}</p>
						) : result.output ? (
							<pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all select-all">
								{result.output}
							</pre>
						) : null}
					</div>
				</>
			}
			footer={
				<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
					<span className="inline-flex items-center gap-1.5">
						<span
							className={`h-1.5 w-1.5 rounded-full ${result.output ? "bg-green-600" : result.error ? "bg-destructive" : "bg-foreground/30"}`}
						/>
						<span className="text-[11px] text-muted-foreground">
							{result.output
								? "Convertido"
								: result.error
									? "Erro"
									: "Aguardando"}
						</span>
					</span>
					{(inputLen > 0 || outputLen > 0) && (
						<span className="font-mono text-[11px] text-muted-foreground">
							{inputLen} chars → {outputLen} chars
						</span>
					)}
				</div>
			}
		/>
	);
}
