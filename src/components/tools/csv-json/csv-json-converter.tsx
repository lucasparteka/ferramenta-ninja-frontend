"use client";

import { Trash2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { Button } from "@/components/ui/button";
import { CsvJsonTable } from "./csv-json-table";
import { useCsvJson } from "./use-csv-json";

export function CsvJsonConverter() {
	const { input, output, errors, tableData, setInput, clear, mode } = useCsvJson();

	const modeLabel =
		mode === "csv-to-json"
			? "CSV → JSON"
			: mode === "json-to-csv"
				? "JSON → CSV"
				: null;

	const inputLen = input.length;
	const outputLen = output.length;

	return (
		<div className="flex flex-col gap-0">
			<LayoutC
				left={
					<>
						<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Entrada
							</span>
							<div className="flex items-center gap-2">
								{modeLabel && (
									<span className="text-[11px] text-muted-foreground">
										{modeLabel}
									</span>
								)}
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={clear}
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
							placeholder="Cole aqui seu CSV ou JSON — o modo é detectado automaticamente..."
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
								text={output}
								disabled={!output}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						</div>

						<div className="flex-1 min-h-[280px] bg-muted/20 p-3">
							{errors.length > 0 ? (
								<div className="space-y-1">
									{errors.map((err) => (
										<p key={err} className="text-xs text-destructive">
											{err}
										</p>
									))}
								</div>
							) : output ? (
								<pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all select-all">
									{output}
								</pre>
							) : null}
						</div>
					</>
				}
				footer={
					<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
						<span className="inline-flex items-center gap-1.5">
							<span
								className={`h-1.5 w-1.5 rounded-full ${
									errors.length > 0
										? "bg-destructive"
										: output
											? "bg-green-600"
											: "bg-foreground/30"
								}`}
							/>
							<span className="text-[11px] text-muted-foreground">
								{errors.length > 0
									? "Erro"
									: output
										? modeLabel ?? "Convertido"
										: "Aguardando"}
							</span>
						</span>
						{(inputLen > 0 || outputLen > 0) && (
							<span className="font-mono text-[11px] text-muted-foreground">
								{inputLen} chars → {outputLen} chars
							</span>
						)}
					</div>
				}
			/>

			{mode === "json-to-csv" && tableData.length > 0 && (
				<div className="mt-4">
					<CsvJsonTable data={tableData} />
				</div>
			)}
		</div>
	);
}
