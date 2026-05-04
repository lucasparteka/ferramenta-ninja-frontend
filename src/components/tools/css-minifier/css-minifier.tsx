"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import {
	ResultBox,
	ResultGrid,
	ResultRow,
} from "@/components/shared/result-box";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MinifierType } from "@/lib/text/minifier";
import { minify } from "@/lib/text/minifier";

const TYPES: { value: MinifierType; label: string }[] = [
	{ value: "css", label: "CSS" },
	{ value: "js", label: "JavaScript" },
	{ value: "html", label: "HTML" },
];

export function CssMinifier() {
	const [type, setType] = useState<MinifierType>("css");
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [stats, setStats] = useState({
		original: 0,
		minified: 0,
		reduction: 0,
	});

	function handleMinify() {
		if (!input.trim()) {
			setOutput("");
			setStats({ original: 0, minified: 0, reduction: 0 });
			return;
		}
		const result = minify(input, type);
		setOutput(result);
		const original = new Blob([input]).size;
		const minified = new Blob([result]).size;
		const reduction =
			original > 0 ? Math.round((1 - minified / original) * 100) : 0;
		setStats({ original, minified, reduction });
	}


	function handleClear() {
		setInput("");
		setOutput("");
		setStats({ original: 0, minified: 0, reduction: 0 });
	}

	function handleTypeChange(newType: MinifierType) {
		setType(newType);
		setOutput("");
		setStats({ original: 0, minified: 0, reduction: 0 });
	}

	return (
		<div className="space-y-6">
			<div className="max-w-4xl space-y-4">
				<div className="space-y-2">
					<p className="text-sm font-medium text-foreground">Tipo</p>
					<div className="flex flex-wrap gap-2">
						{TYPES.map((t) => (
							<Button
								key={t.value}
								type="button"
								variant={type === t.value ? "default" : "outline"}
								size="sm"
								onClick={() => handleTypeChange(t.value)}
							>
								{t.label}
							</Button>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="minifier-input"
						className="block text-sm font-medium text-foreground"
					>
						Código original
					</label>
					<Textarea
						id="minifier-input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={`Cole seu ${type.toUpperCase()} aqui...`}
						className="min-h-[400px] font-mono text-foreground"
						spellCheck={false}
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={handleMinify} disabled={!input.trim()}>
						Minificar
					</Button>
					<CopyButton text={output} label="Copiar resultado" disabled={!output} variant="outline" />
					<Button
						onClick={handleClear}
						disabled={!input && !output}
						variant="secondary"
					>
						<Trash />
						Limpar
					</Button>
				</div>
			</div>

			{output && (
				<div className="max-w-4xl space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="minifier-output"
							className="block text-sm font-medium text-foreground"
						>
							Código minificado
						</label>
						<pre
							id="minifier-output"
							className="overflow-x-auto rounded-lg border bg-white border-input p-4 font-mono text-sm"
						>
							<code>{output}</code>
						</pre>
					</div>

					<ResultBox tone="primary">
						<p className="text-3xl font-bold">
							-{stats.reduction}%
						</p>
						<p className="mt-1 text-sm">
							Redução de {stats.original} bytes para {stats.minified} bytes
						</p>
					</ResultBox>

					<ResultGrid>
						<ResultRow
							label="Tamanho original"
							value={`${stats.original} bytes`}
						/>
						<ResultRow
							label="Tamanho minificado"
							value={`${stats.minified} bytes`}
						/>
					</ResultGrid>
				</div>
			)}
		</div>
	);
}
