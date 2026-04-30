"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type OcrState = "idle" | "loading" | "success" | "error";

type OcrOutputProps = {
	state: OcrState;
	result: string;
	errorMsg: string;
	progress: number;
	copied: boolean;
	onChange: (value: string) => void;
	onCopy: () => void;
};

export function OcrOutput({
	state,
	result,
	errorMsg,
	progress,
	copied,
	onChange,
	onCopy,
}: OcrOutputProps) {
	return (
		<div className="flex h-full flex-col space-y-1">
			<div className="flex items-center justify-between">
				<label
					htmlFor="ocr-result"
					className="block text-sm font-medium text-foreground"
				>
					Texto extraído
				</label>
				{result && (
					<Button variant="outline" size="sm" onClick={onCopy}>
						{copied ? "Copiado!" : "Copiar texto"}
					</Button>
				)}
			</div>
			<div
				aria-live="polite"
				aria-atomic="true"
				className="flex min-h-56 flex-1 flex-col rounded-lg border border-border bg-secondary"
			>
				{state === "idle" && (
					<p className="p-4 text-sm text-muted-foreground">
						O texto extraído da imagem aparecerá aqui após clicar em "Extrair
						texto".
					</p>
				)}
				{state === "loading" && (
					<div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
						<p className="text-sm text-muted-foreground">
							Processando imagem...
						</p>
						<div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-border">
							<div
								className="h-full rounded-full bg-primary transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">{progress}%</p>
					</div>
				)}
				{state === "error" && (
					<p className="p-4 text-sm text-destructive">{errorMsg}</p>
				)}
				{state === "success" && (
					<Textarea
						id="ocr-result"
						value={result}
						onChange={(e) => onChange(e.target.value)}
						aria-label="Texto extraído da imagem"
						className="flex-1 resize-none border-0 bg-transparent p-4"
						rows={10}
					/>
				)}
			</div>
		</div>
	);
}
