"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import type { MinifierType } from "@/lib/text/minifier";
import { minify } from "@/lib/text/minifier";

const TYPES: { value: MinifierType; label: string }[] = [
	{ value: "css", label: "CSS" },
	{ value: "js", label: "JS" },
	{ value: "html", label: "HTML" },
];

export function CssMinifier() {
	const [type, setType] = useState<MinifierType>("css");
	const [input, setInput] = useState("");

	const result = useMemo(() => {
		if (!input.trim())
			return { output: "", original: 0, minified: 0, reduction: 0 };
		const output = minify(input, type);
		const original = new Blob([input]).size;
		const minified = new Blob([output]).size;
		const reduction =
			original > 0 ? Math.round((1 - minified / original) * 100) : 0;
		return { output, original, minified, reduction };
	}, [input, type]);

	function handleTypeChange(newType: MinifierType) {
		setType(newType);
	}

	function handleClear() {
		setInput("");
	}

	return (
		<LayoutC
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<div className="flex items-center gap-1">
							{TYPES.map((t) => (
								<button
									key={t.value}
									type="button"
									onClick={() => handleTypeChange(t.value)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										type === t.value
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{t.label}
								</button>
							))}
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
						placeholder={`Cole seu ${type.toUpperCase()} aqui...`}
						className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						spellCheck={false}
					/>
				</>
			}
			right={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Minificado
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
						{result.output ? (
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
								? `Minificado · -${result.reduction}%`
								: "Aguardando",
							mono: false,
							variant: result.output ? "success" : "default",
						},
						{ label: "Original", value: `${result.original}B`, mono: true },
						{ label: "Minificado", value: `${result.minified}B`, mono: true },
					]}
				/>
			}
		/>
	);
}
