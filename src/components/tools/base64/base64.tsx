"use client";

import { useState } from "react";
import { ResultGrid, ResultRow } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decodeBase64, encodeBase64 } from "@/lib/encoding/base64";

const MODES = [
	{ value: "encode", label: "Codificar" },
	{ value: "decode", label: "Decodificar" },
] as const;

export function Base64Tool() {
	const [mode, setMode] = useState<(typeof MODES)[number]["value"]>("encode");
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [stats, setStats] = useState({ inputChars: 0, outputChars: 0 });

	function handleConvert() {
		setError(null);
		setCopied(false);
		if (!input) {
			setOutput("");
			setStats({ inputChars: 0, outputChars: 0 });
			return;
		}
		try {
			const result =
				mode === "encode" ? encodeBase64(input) : decodeBase64(input);
			setOutput(result);
			setStats({ inputChars: input.length, outputChars: result.length });
		} catch (e) {
			setOutput("");
			setStats({ inputChars: input.length, outputChars: 0 });
			setError(e instanceof Error ? e.message : "Erro desconhecido.");
		}
	}

	function handleCopy() {
		if (!output) return;
		navigator.clipboard.writeText(output);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	function handleClear() {
		setInput("");
		setOutput("");
		setError(null);
		setCopied(false);
		setStats({ inputChars: 0, outputChars: 0 });
	}

	function handleModeChange(newMode: (typeof MODES)[number]["value"]) {
		setMode(newMode);
		setOutput("");
		setError(null);
		setCopied(false);
	}

	return (
		<div className="space-y-6">
			<div className="max-w-4xl space-y-4">
				<div className="space-y-2">
					<p className="text-sm font-medium text-foreground">Modo</p>
					<div className="flex flex-wrap gap-2">
						{MODES.map((m) => (
							<Button
								key={m.value}
								type="button"
								variant={mode === m.value ? "default" : "outline"}
								size="sm"
								onClick={() => handleModeChange(m.value)}
							>
								{m.label}
							</Button>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="base64-input"
						className="block text-sm font-medium text-foreground"
					>
						{mode === "encode" ? "Texto original" : "Texto em Base64"}
					</label>
					<Textarea
						id="base64-input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "encode"
								? "Digite o texto aqui..."
								: "Cole o Base64 aqui..."
						}
						className="min-h-[300px] font-mono text-foreground"
						spellCheck={false}
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={handleConvert} disabled={!input.trim()}>
						{mode === "encode" ? "Codificar" : "Decodificar"}
					</Button>
					<Button onClick={handleCopy} disabled={!output} variant="outline">
						{copied ? "Copiado!" : "Copiar resultado"}
					</Button>
					<Button
						onClick={handleClear}
						disabled={!input && !output}
						variant="ghost"
					>
						Limpar
					</Button>
				</div>
			</div>

			{error && (
				<div className="max-w-4xl rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
					<p className="text-sm font-medium text-destructive">{error}</p>
				</div>
			)}

			{output && !error && (
				<div className="max-w-4xl space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="base64-output"
							className="block text-sm font-medium text-foreground"
						>
							{mode === "encode" ? "Resultado em Base64" : "Texto decodificado"}
						</label>
						<pre
							id="base64-output"
							className="overflow-x-auto rounded-lg border bg-white border-input p-4 font-mono text-sm"
						>
							<code>{output}</code>
						</pre>
					</div>

					<ResultGrid>
						<ResultRow label="Caracteres de entrada" value={stats.inputChars} />
						<ResultRow label="Caracteres de saída" value={stats.outputChars} />
					</ResultGrid>
				</div>
			)}
		</div>
	);
}
