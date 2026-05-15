"use client";

import { Download, RotateCcw, Shuffle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { PaneHeader } from "@/components/shared/pane-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import {
	convertToCSV,
	downloadFile,
	generateApiErrorResponse,
	generateApiSuccessResponse,
	generateEdgeCases,
	generatePaginationResponse,
	generateProducts,
	generateUsers,
	type MockDataType,
} from "@/lib/mock-data/generators";
import { cn } from "@/lib/utils";

const DATA_TYPES: { value: MockDataType; label: string }[] = [
	{ value: "user", label: "Usuário" },
	{ value: "product", label: "Produto" },
	{ value: "api-success", label: "API Response (Sucesso)" },
	{ value: "api-error", label: "API Response (Erro)" },
	{ value: "pagination", label: "Paginação" },
	{ value: "edge-cases", label: "Edge Cases" },
];

const QUANTITIES = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];

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
			(_, str) => `: ${span(str, "token-string")}`,
		)
		.replace(
			/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,
			(_, num) => `: ${span(num, "token-number")}`,
		)
		.replace(
			/:\s*(true|false|null)/g,
			(_, kw) => `: ${span(kw, "token-boolean")}`,
		);
}

function generateData(
	type: MockDataType,
	count: number,
): {
	json: Record<string, unknown> | Record<string, unknown>[];
	format: "single" | "array";
} {
	switch (type) {
		case "user": {
			const users = generateUsers(count);
			return {
				json: users as unknown as Record<string, unknown>[],
				format: "array",
			};
		}
		case "product": {
			const products = generateProducts(count);
			return {
				json: products as unknown as Record<string, unknown>[],
				format: "array",
			};
		}
		case "api-success": {
			const data =
				type === "api-success" ? generateUsers(Math.min(count, 5)) : [];
			return { json: generateApiSuccessResponse(data), format: "single" };
		}
		case "api-error":
			return { json: generateApiErrorResponse(), format: "single" };
		case "pagination": {
			const data = generateUsers(100);
			const paginated = generatePaginationResponse(
				data,
				1,
				Math.min(count, 100),
			);
			return {
				json: paginated as unknown as Record<string, unknown>,
				format: "single",
			};
		}
		case "edge-cases":
			return { json: generateEdgeCases(), format: "single" };
	}
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function MockDataGenerator() {
	const [dataType, setDataType] = useState<MockDataType>("user");
	const [quantity, setQuantity] = useState(10);
	const [format, setFormat] = useState<"json" | "csv">("json");
	const [output, setOutput] = useState("");
	const [minified, setMinified] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);

	const result = useMemo(() => {
		if (!output) return null;
		try {
			return JSON.parse(output) as Record<string, unknown>;
		} catch {
			return null;
		}
	}, [output]);

	const recordCount = useMemo(() => {
		if (!output) return 0;
		if (format === "csv") {
			const lines = output.trim().split("\n").filter(Boolean);
			return Math.max(0, lines.length - 1);
		}
		if (!result) return 0;
		if (Array.isArray(result)) return result.length;
		if (result.data && Array.isArray(result.data)) {
			return (result.data as unknown[]).length;
		}
		return 1;
	}, [output, format, result]);

	const bytes = useMemo(
		() => new TextEncoder().encode(output).length,
		[output],
	);

	const showCSV = dataType === "user" || dataType === "product";
	const isArrayType = dataType === "user" || dataType === "product";
	const isSingleArray = dataType === "pagination" || dataType === "api-success";

	function handleGenerate() {
		setIsGenerating(true);

		setTimeout(() => {
			const { json } = generateData(dataType, quantity);

			if (format === "csv" && showCSV) {
				const arr = Array.isArray(json) ? json : [json];
				const csv = convertToCSV(arr as Record<string, unknown>[]);
				setOutput(csv);
			} else {
				const space = minified ? 0 : 2;
				setOutput(JSON.stringify(json, null, space));
			}

			setIsGenerating(false);
		}, 0);
	}

	function handleReset() {
		setOutput("");
	}

	const handleDownloadJSON = useCallback(() => {
		try {
			const data = JSON.parse(output);
			const formatted = JSON.stringify(data, null, 2);
			downloadFile(formatted, `mock-data-${dataType}.json`, "application/json");
		} catch {
			downloadFile(output, `mock-data-${dataType}.json`, "application/json");
		}
	}, [output, dataType]);

	const handleDownloadCSV = useCallback(() => {
		if (!output) return;
		downloadFile(output, `mock-data-${dataType}.csv`, "text/csv");
	}, [output, dataType]);

	function applyFormat(minify: boolean) {
		setMinified(minify);
		if (output) {
			try {
				const parsed = JSON.parse(output);
				setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
			} catch {
				/* ignore */
			}
		}
	}

	return (
		<div className="grid grid-cols-1 gap-0 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<PaneHeader
					title="Gerador de Dados Mock"
					badge={<Chip tone="neutral">DADOS</Chip>}
				/>
				<div className="divide-y divide-border">
					<div className="p-4">
						<SectionLabel>Configuração</SectionLabel>
						<div className="space-y-3">
							<div>
								<Label
									htmlFor="data-type"
									className="mb-1.5 block text-xs text-foreground"
								>
									Tipo de dado
								</Label>
								<NativeSelect
									id="data-type"
									value={dataType}
									onChange={(e) => {
										setDataType(e.target.value as MockDataType);
										setOutput("");
									}}
								>
									{DATA_TYPES.map((dt) => (
										<option key={dt.value} value={dt.value}>
											{dt.label}
										</option>
									))}
								</NativeSelect>
							</div>

							<div>
								<Label
									htmlFor="quantity"
									className="mb-1.5 block text-xs text-foreground"
								>
									Quantidade
								</Label>
								<NativeSelect
									id="quantity"
									value={quantity}
									onChange={(e) => {
										setQuantity(Number(e.target.value));
										setOutput("");
									}}
								>
									{QUANTITIES.map((q) => (
										<option key={q} value={q}>
											{q}
										</option>
									))}
								</NativeSelect>
							</div>

							<div>
								<Label
									htmlFor="output-format"
									className="mb-1.5 block text-xs text-foreground"
								>
									Formato de saída
								</Label>
								<NativeSelect
									id="output-format"
									value={format}
									onChange={(e) => {
										setFormat(e.target.value as "json" | "csv");
										setOutput("");
									}}
								>
									<option value="json">JSON</option>
									<option value="csv" disabled={!showCSV}>
										CSV {!showCSV ? "(apenas usuário/produto)" : ""}
									</option>
								</NativeSelect>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3 mt-auto">
					<span className="text-[11px] text-muted-foreground">
						Dados gerados no navegador
					</span>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleReset}
							disabled={!output}
						>
							<RotateCcw className="mr-1.5 h-3 w-3" />
							Resetar
						</Button>
						<Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
							<Shuffle />
							{isGenerating ? "Gerando..." : "Gerar dados"}
						</Button>
					</div>
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{!output ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-h-[12rem]">
						<p className="text-sm text-muted-foreground">
							Configure e clique em Gerar para obter dados
						</p>
					</div>
				) : (
					<>
						<div className="p-4 border-b border-border">
							<div className="mb-1.5 flex items-center justify-between">
								<span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
									Resultado
								</span>
								<Chip tone="neutral">{format.toUpperCase()}</Chip>
							</div>
							<div className="flex items-center gap-3">
								{isArrayType && (
									<span className="font-mono text-[12.5px] tabular-nums text-foreground">
										{recordCount} {recordCount === 1 ? "registro" : "registros"}
									</span>
								)}
								{isArrayType && (
									<span className="text-muted-foreground">·</span>
								)}
								<span className="font-mono text-[12.5px] tabular-nums text-muted-foreground">
									{formatBytes(bytes)}
								</span>
							</div>
						</div>

						{format === "json" && (isArrayType || isSingleArray) && (
							<div className="flex items-center gap-1 border-b border-border px-4 py-2">
								<button
									type="button"
									onClick={() => applyFormat(false)}
									className={cn(
										"rounded px-2.5 py-1 text-xs transition-colors",
										!minified
											? "bg-foreground/10 text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									Formatado
								</button>
								<button
									type="button"
									onClick={() => applyFormat(true)}
									className={cn(
										"rounded px-2.5 py-1 text-xs transition-colors",
										minified
											? "bg-foreground/10 text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									Minificado
								</button>
							</div>
						)}

						<div className="flex-1 overflow-hidden p-4">
							<pre
								className={cn(
									"max-h-112 overflow-auto rounded border border-border bg-card p-3 font-mono text-[11.5px] text-foreground",
									format === "json" && "json-formatter",
								)}
								// biome-ignore lint/security/noDangerouslySetInnerHtml: .
								dangerouslySetInnerHTML={{
									__html:
										format === "json"
											? highlightJSON(output)
											: escapeHtml(output),
								}}
							/>
						</div>

						<div className="flex flex-wrap gap-2 border-t border-border p-3">
							<CopyButton
								text={output}
								label="Copiar"
								variant="outline"
								size="sm"
							/>

							{format === "json" && (
								<Button
									onClick={handleDownloadJSON}
									variant="outline"
									size="sm"
									disabled={!output}
								>
									<Download />
									Download JSON
								</Button>
							)}

							{format === "csv" && showCSV && (
								<Button
									onClick={handleDownloadCSV}
									variant="outline"
									size="sm"
									disabled={!output}
								>
									<Download />
									Download CSV
								</Button>
							)}
						</div>
					</>
				)}
			</aside>
		</div>
	);
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}
