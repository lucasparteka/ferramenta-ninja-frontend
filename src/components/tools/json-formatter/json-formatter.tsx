"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { OptionSwitch } from "@/components/shared/option-switch";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";

type Status = "idle" | "invalid" | "formatted" | "minified";

type ErrorInfo = {
	message: string;
	line: number;
	column: number;
};

function parseErrorPosition(error: SyntaxError, input: string): ErrorInfo {
	const match = error.message.match(/position\s+(\d+)/i);
	let pos = 0;
	if (match) {
		pos = parseInt(match[1], 10);
	}

	const lines = input.substring(0, pos).split("\n");
	const line = lines.length;
	const column = lines[lines.length - 1].length + 1;

	return {
		message: error.message,
		line,
		column,
	};
}

function highlightJSON(json: string): string {
	const span = (content: string, cls: string) =>
		`<span class="${cls}">${content}</span>`;

	return json
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(
			/("(?:[^"\\]|\\.)*")(\s*:)/g,
			(_, key, sep) => span(key, "token-key") + sep,
		)
		.replace(
			/:\s*("(?:[^"\\]|\\.)*")/g,
			(_: string, str: string) => `: ${span(str, "token-string")}`,
		)
		.replace(
			/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,
			(_: string, num: string) => `: ${span(num, "token-number")}`,
		)
		.replace(
			/:\s*(true|false|null)/g,
			(_: string, kw: string) => `: ${span(kw, "token-boolean")}`,
		);
}

export function JsonFormatter() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [mode, setMode] = useState<"format" | "minify">("format");
	const [indentSize, setIndentSize] = useState<2 | 4>(2);
	const [error, setError] = useState<ErrorInfo | null>(null);

	function formatText(value: string, indent: number) {
		try {
			const parsed = JSON.parse(value);
			const formatted = JSON.stringify(parsed, null, indent);
			setOutput(formatted);
			setStatus("formatted");
			setError(null);
		} catch (e) {
			if (e instanceof SyntaxError) {
				setStatus("invalid");
				setError(parseErrorPosition(e, value));
				setOutput("");
			}
		}
	}

	function handleInputChange(value: string) {
		setInput(value);
		if (!value.trim()) {
			setStatus("idle");
			setOutput("");
			setError(null);
			return;
		}
		if (mode === "minify") {
			try {
				const parsed = JSON.parse(value);
				setOutput(JSON.stringify(parsed));
				setStatus("minified");
				setError(null);
			} catch (e) {
				if (e instanceof SyntaxError) {
					setStatus("invalid");
					setError(parseErrorPosition(e, value));
					setOutput("");
				}
			}
		} else {
			formatText(value, indentSize);
		}
	}

	function handleClear() {
		setInput("");
		setOutput("");
		setStatus("idle");
		setError(null);
	}

	function handleModeChange(v: string) {
		const newMode = v as "format" | "minify";
		setMode(newMode);
		if (!input.trim()) return;
		if (newMode === "minify") {
			try {
				const parsed = JSON.parse(input);
				setOutput(JSON.stringify(parsed));
				setStatus("minified");
				setError(null);
			} catch {
				setStatus("invalid");
			}
		} else {
			formatText(input, indentSize);
		}
	}

	function handleIndentChange(size: 2 | 4) {
		setIndentSize(size);
		if (!input.trim() || mode !== "format") return;
		try {
			const parsed = JSON.parse(input);
			setOutput(JSON.stringify(parsed, null, size));
			setStatus("formatted");
		} catch {
			// input is already known invalid
		}
	}

	const hasResult = output.length > 0;
	const inputBytes = new TextEncoder().encode(input).length;
	const outputBytes = new TextEncoder().encode(output).length;

	return (
		<LayoutC
			toolbar={
				<>
					<div className="flex items-center gap-4">
						<span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
							Modo
						</span>
						<OptionSwitch
							options={[
								{ label: "Formatar", value: "format" },
								{ label: "Minificar", value: "minify" },
							]}
							value={mode}
							onChange={handleModeChange}
							size="sm"
						/>
					</div>
					{mode === "format" && (
						<div className="flex items-center gap-2">
							<span className="text-caption text-muted-foreground">
								Espaços:
							</span>
							<Button
								variant={indentSize === 2 ? "default" : "ghost"}
								size="xs"
								onClick={() => handleIndentChange(2)}
								className="h-6 min-w-6 px-1.5 text-caption"
							>
								2
							</Button>
							<Button
								variant={indentSize === 4 ? "default" : "ghost"}
								size="xs"
								onClick={() => handleIndentChange(4)}
								className="h-6 min-w-6 px-1.5 text-caption"
							>
								4
							</Button>
						</div>
					)}
				</>
			}
			left={
				<>
					<PaneHeader
						title="Entrada"
						actions={
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Limpar"
								onClick={handleClear}
								disabled={!input}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						}
					/>
					<textarea
						value={input}
						onChange={(e) => handleInputChange(e.target.value)}
						placeholder='{"exemplo": "cole seu JSON aqui"}'
						className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm"
						spellCheck={false}
					/>
				</>
			}
			right={
				<>
					<PaneHeader
						title={
							<>
								Saída{" "}
								{hasResult && (
									<span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success">
										Pronto
									</span>
								)}
							</>
						}
						actions={
							<CopyButton
								text={output}
								disabled={!output}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						}
					/>
					<div className="flex-1 min-h-[280px] bg-muted/20 p-3 overflow-auto">
						{hasResult ? (
							<pre
								className="font-mono text-sm whitespace-pre-wrap break-all select-all"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: syntax highlight
								dangerouslySetInnerHTML={{
									__html: highlightJSON(output),
								}}
							/>
						) : status === "invalid" && error ? (
							<div className="space-y-2">
								<p className="text-sm font-medium text-destructive">
									Erro na linha {error.line}, coluna {error.column}
								</p>
								<p className="text-xs text-destructive/80">{error.message}</p>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								O JSON formatado aparecerá aqui...
							</p>
						)}
					</div>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value:
								status === "invalid"
									? "Inválido"
									: hasResult
										? "Válido"
										: "Aguardando",
							mono: false,
							variant:
								status === "invalid"
									? "danger"
									: hasResult
										? "success"
										: "default",
						},
						{
							label: "Entrada",
							value: `${inputBytes} bytes · ${input.split("\n").length} linhas`,
							mono: true,
						},
						...(hasResult
							? [
									{
										label: "Saída",
										value: `${outputBytes} bytes`,
										mono: true,
									} as const,
								]
							: []),
					]}
					right={
						status === "invalid" && error ? (
							<span className="font-mono text-caption text-destructive">
								Linha {error.line}, coluna {error.column}
							</span>
						) : undefined
					}
				/>
			}
		/>
	);
}
