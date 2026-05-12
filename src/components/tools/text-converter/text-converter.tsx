"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import {
	capitalize,
	removeAccents,
	removeExtraSpaces,
	reverseText,
	toLowercase,
	toUppercase,
} from "@/lib/text/transformations";

type TransformKey =
	| "uppercase"
	| "lowercase"
	| "capitalize"
	| "removeExtraSpaces"
	| "removeAccents"
	| "reverseText";

const transformMap: Record<TransformKey, (text: string) => string> = {
	uppercase: toUppercase,
	lowercase: toLowercase,
	capitalize: capitalize,
	removeExtraSpaces: removeExtraSpaces,
	removeAccents: removeAccents,
	reverseText: reverseText,
};

const transformations: { key: TransformKey; label: string }[] = [
	{ key: "uppercase", label: "MAIÚSCULO" },
	{ key: "lowercase", label: "minúsculo" },
	{ key: "capitalize", label: "Capitalizar" },
	{ key: "removeExtraSpaces", label: "Remover espaços" },
	{ key: "removeAccents", label: "Remover acentos" },
	{ key: "reverseText", label: "Inverter" },
];

export function TextConverter() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	function handleTransform(key: string) {
		const fn = transformMap[key as TransformKey];
		if (!fn || !input.trim()) return;
		setOutput(fn(input));
	}

	function handleClear() {
		setInput("");
		setOutput("");
	}

	const inputLen = input.length;
	const outputLen = output.length;

	return (
		<LayoutC
			toolbar={
				<div className="flex flex-wrap gap-1">
					{transformations.map((t) => (
						<button
							key={t.key}
							type="button"
							onClick={() => handleTransform(t.key)}
							disabled={!input.trim()}
							className="rounded px-2 py-0.5 text-[11px] bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors disabled:opacity-40 disabled:pointer-events-none"
						>
							{t.label}
						</button>
					))}
				</div>
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
						onChange={(e) => setInput(e.target.value)}
						placeholder="Cole ou digite o texto que deseja converter..."
						className="flex-1 min-h-70 resize-none bg-transparent p-3 font-mono text-sm"
						spellCheck={false}
					/>
				</>
			}
			right={
				<>
					<PaneHeader
						title="Resultado"
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
					<div className="flex-1 min-h-70 bg-muted/20 p-3 cursor-default select-all">
						{output ? (
							<pre className="font-mono text-sm whitespace-pre-wrap break-all">
								{output}
							</pre>
						) : (
							<p className="text-sm text-muted-foreground">
								O resultado aparecerá aqui...
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
							value: output ? "Transformado" : "Aguardando",
							mono: false,
							variant: output ? "success" : "default",
						},
						{ label: "Entrada", value: `${inputLen} chars`, mono: true },
						{ label: "Saída", value: `${outputLen} chars`, mono: true },
					]}
				/>
			}
		/>
	);
}
