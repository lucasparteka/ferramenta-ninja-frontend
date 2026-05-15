"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import {
	OptionSwitch,
	type OptionSwitchOption,
} from "@/components/shared/option-switch";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { binaryToText, textToBinary } from "@/lib/encoding/binary";
import { cn } from "@/lib/utils";

type Mode = "encode" | "decode";

const MODE_OPTIONS = [
	{ label: "Texto → Bin", value: "encode" },
	{ label: "Bin → Texto", value: "decode" },
] satisfies OptionSwitchOption[];

const SEPARATOR_OPTIONS = [
	{ label: "Espaço", value: " " },
	{ label: "Nenhum", value: "" },
] satisfies OptionSwitchOption[];

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
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<div className="flex items-center gap-2">
							<OptionSwitch
								options={MODE_OPTIONS}
								value={mode}
								onChange={(v) => setMode(v as Mode)}
								size="sm"
							/>
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
							<span className="text-caption text-muted-foreground">
								Separador
							</span>
							<OptionSwitch
								options={SEPARATOR_OPTIONS}
								value={separator}
								onChange={setSeparator}
								size="sm"
							/>
						</div>
					)}
				</>
			}
			right={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
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
