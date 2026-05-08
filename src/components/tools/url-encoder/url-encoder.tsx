"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Textarea } from "@/components/ui/textarea";
import { encodeURL, decodeURL } from "@/lib/encoding/url";
import { Info } from "lucide-react";

export function URLEncoder() {
	const [direction, setDirection] = useState<"encode" | "decode">("encode");
	const [mode, setMode] = useState<"component" | "full">("component");
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");

	function process(
		value: string,
		dir: "encode" | "decode",
		encMode: "component" | "full",
	) {
		setError("");
		if (!value.trim()) {
			setOutput("");
			return;
		}
		try {
			if (dir === "encode") {
				setOutput(encodeURL(value, encMode));
			} else {
				setOutput(decodeURL(value));
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erro na conversão.");
			setOutput("");
		}
	}

	function handleInputChange(value: string) {
		setInput(value);
		process(value, direction, mode);
	}

	function handleDirectionChange(newDir: "encode" | "decode") {
		setDirection(newDir);
		process(input, newDir, mode);
	}

	function handleModeChange(newMode: "component" | "full") {
		setMode(newMode);
		if (direction === "encode") {
			process(input, direction, newMode);
		}
	}

	return (
		<div className="space-y-6">
			<OptionSwitch
				options={[
					{ label: "Codificar", value: "encode" },
					{ label: "Decodificar", value: "decode" },
				]}
				value={direction}
				onChange={(v) => handleDirectionChange(v as "encode" | "decode")}
			/>

			{direction === "encode" && (
				<div className="space-y-3">
					<OptionSwitch
						options={[
							{ label: "encodeURIComponent", value: "component" },
							{ label: "encodeURI (URL inteira)", value: "full" },
						]}
						value={mode}
						onChange={(v) => handleModeChange(v as "component" | "full")}
					/>
					<div className="flex items-start gap-2 rounded-md border border-border bg-secondary p-3 text-xs text-muted-foreground">
						<Info className="mt-0.5 h-4 w-4 shrink-0" />
						<div className="space-y-1">
							<p>
								<strong>encodeURIComponent:</strong> codifica TUDO incluindo
								caracteres especiais como <code>://</code>, <code>/</code>,{" "}
								<code>?</code>, <code>&amp;</code>, <code>=</code>. Use para{" "}
								<strong>query parameters</strong> e partes de URL.
							</p>
							<p>
								<strong>encodeURI:</strong> preserva a estrutura da URL (
								<code>://</code>, <code>/</code>, <code>?</code>,{" "}
								<code>&amp;</code>, <code>=</code>, <code>#</code>). Use para
								codificar uma <strong>URL completa</strong>.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-6 sm:flex-row">
				<div className="space-y-1 sm:flex-1">
					<label
						htmlFor="url-input"
						className="text-sm font-medium text-foreground"
					>
						{direction === "encode"
							? "Texto ou URL para codificar"
							: "URL codificada para decodificar"}
					</label>
					<Textarea
						id="url-input"
						rows={8}
						placeholder={
							direction === "encode"
								? "Digite o texto ou cole a URL aqui..."
								: "Cole a URL codificada aqui..."
						}
						value={input}
						onChange={(e) => handleInputChange(e.target.value)}
						className="resize-none"
					/>
				</div>
				<div className="space-y-1 sm:flex-1">
					<label
						htmlFor="url-output"
						className="text-sm font-medium text-foreground"
					>
						Resultado
					</label>
					<Textarea
						id="url-output"
						rows={8}
						readOnly
						value={output}
						placeholder="O resultado aparecerá aqui..."
						className="resize-none"
					/>
					<div className="flex justify-end">
						<CopyButton text={output} label="Copiar" disabled={!output} />
					</div>
				</div>
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}
