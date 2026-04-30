"use client";

import { Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Status = "idle" | "valid" | "invalid" | "formatted" | "minified";

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
		.replace(/("(?:[^"\\]|\\.)*")\s*:/g, (_, key) => span(key, "token-key"))
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
	const [indentSize, setIndentSize] = useState<2 | 4>(2);
	const [error, setError] = useState<ErrorInfo | null>(null);
	const [copied, setCopied] = useState(false);

	const validateInput = useCallback((value: string) => {
		if (!value.trim()) {
			setStatus("idle");
			setOutput("");
			setError(null);
			return;
		}

		try {
			JSON.parse(value);
			setStatus("valid");
			setError(null);
		} catch (e) {
			if (e instanceof SyntaxError) {
				setStatus("invalid");
				setError(parseErrorPosition(e, value));
			}
		}
	}, []);

	function handleInputChange(value: string) {
		setInput(value);
		validateInput(value);
	}

	function handleFormat() {
		try {
			const parsed = JSON.parse(input);
			const formatted = JSON.stringify(parsed, null, indentSize);
			setOutput(formatted);
			setStatus("formatted");
			setError(null);
		} catch (e) {
			if (e instanceof SyntaxError) {
				setStatus("invalid");
				setError(parseErrorPosition(e, input));
			}
		}
	}

	function handleMinify() {
		try {
			const parsed = JSON.parse(input);
			const minified = JSON.stringify(parsed);
			setOutput(minified);
			setStatus("minified");
			setError(null);
		} catch (e) {
			if (e instanceof SyntaxError) {
				setStatus("invalid");
				setError(parseErrorPosition(e, input));
			}
		}
	}

	function handleCopy() {
		const textToCopy = output || input;
		if (!textToCopy) return;
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	function handleClear() {
		setInput("");
		setOutput("");
		setStatus("idle");
		setError(null);
		setCopied(false);
	}

	const hasResult = output.length > 0;

	return (
		<div className="space-y-4">
			<div>
				<label
					htmlFor="json-input"
					className="mb-1 block text-sm font-medium text-foreground"
				>
					Cole seu JSON aqui
				</label>
				<Textarea
					id="json-input"
					value={input}
					onChange={(e) => handleInputChange(e.target.value)}
					placeholder='{"exemplo": "cole seu JSON aqui"}'
					className="min-h-70 font-mono"
					spellCheck={false}
				/>
			</div>

			{status === "invalid" && error && (
				<div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
					<p className="text-sm font-medium text-destructive">
						Erro na linha {error.line}, coluna {error.column}
					</p>
					<p className="text-sm text-destructive/80">{error.message}</p>
				</div>
			)}

			{status === "valid" && !hasResult && (
				<div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
					<p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
						JSON válido
					</p>
				</div>
			)}

			<div className="flex flex-wrap items-center gap-2">
				<Button onClick={handleFormat} disabled={!input.trim()}>
					Formatar
				</Button>
				<Button
					onClick={handleMinify}
					disabled={!input.trim()}
					variant="secondary"
				>
					Minificar
				</Button>
				<Button onClick={handleCopy} disabled={!input.trim()} variant="outline">
					{copied ? "Copiado!" : "Copiar"}
				</Button>
				<Button
					onClick={handleClear}
					disabled={!input.trim() && !output}
					variant="secondary"
				>
					<Trash />
					Limpar
				</Button>
				<div className="ml-auto flex items-center gap-2">
					<span className="text-xs text-muted-foreground">Espaços:</span>
					<Button
						variant={indentSize === 2 ? "default" : "outline"}
						size="sm"
						onClick={() => setIndentSize(2)}
					>
						2
					</Button>
					<Button
						variant={indentSize === 4 ? "default" : "outline"}
						size="sm"
						onClick={() => setIndentSize(4)}
					>
						4
					</Button>
				</div>
			</div>

			{hasResult && (
				<div>
					<div className="mb-1 flex items-center justify-between">
						<div className="text-sm font-medium text-foreground">
							{status === "formatted" ? "JSON formatado" : "JSON minificado"}
						</div>
					</div>
					<pre
						className={cn(
							"json-formatter max-h-96 overflow-auto rounded-lg border border-input bg-white p-4 font-mono text-sm text-foreground",
						)}
						// biome-ignore lint/security/noDangerouslySetInnerHtml: ...
						dangerouslySetInnerHTML={{
							__html: highlightJSON(output),
						}}
					/>
				</div>
			)}
		</div>
	);
}
