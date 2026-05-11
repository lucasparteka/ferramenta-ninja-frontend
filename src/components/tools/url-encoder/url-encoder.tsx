"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { decodeURL, encodeURL } from "@/lib/encoding/url";

type Direction = "encode" | "decode";
type EncMode = "component" | "full";

export function URLEncoder() {
	const [input, setInput] = useState("");
	const [direction, setDirection] = useState<Direction>("encode");
	const [encMode, setEncMode] = useState<EncMode>("component");

	const result = useMemo(() => {
		if (!input.trim()) return { output: "", error: null };
		try {
			const output =
				direction === "encode" ? encodeURL(input, encMode) : decodeURL(input);
			return { output, error: null };
		} catch (e) {
			return {
				output: "",
				error: e instanceof Error ? e.message : "Erro desconhecido.",
			};
		}
	}, [input, direction, encMode]);

	function handleSwap() {
		if (result.output) {
			setInput(result.output);
			setDirection(direction === "encode" ? "decode" : "encode");
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
							{(["encode", "decode"] as const).map((d) => (
								<button
									key={d}
									type="button"
									onClick={() => setDirection(d)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										direction === d
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{d === "encode" ? "Codificar" : "Decodificar"}
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

					{direction === "encode" && (
						<div className="flex items-center justify-between border-b border-border px-3 py-2">
							<span className="text-[11px] text-muted-foreground">Modo</span>
							<div className="flex items-center gap-1">
								{(
									[
										{ label: "Parâmetro", value: "component" },
										{ label: "URL completa", value: "full" },
									] as const
								).map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() => setEncMode(opt.value)}
										className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
											encMode === opt.value
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

					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							direction === "encode"
								? "Digite o texto ou cole a URL aqui..."
								: "Cole a URL codificada aqui..."
						}
						className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						spellCheck={false}
					/>
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
				<StatusBar
					items={[
						{
							label: "",
							value: result.output
								? "Convertido"
								: result.error
									? "Erro"
									: "Aguardando",
							mono: false,
							variant: result.output
								? "success"
								: result.error
									? "danger"
									: "default",
						},
						{ label: "Entrada", value: `${inputLen} chars`, mono: true },
						{ label: "Saída", value: `${outputLen} chars`, mono: true },
					]}
				/>
			}
		/>
	);
}
