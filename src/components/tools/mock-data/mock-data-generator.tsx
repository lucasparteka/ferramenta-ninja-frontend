"use client";

import { Download, Shuffle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";
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
		.replace(
			/("(?:[^"\\]|\\.)*")\s*:/g,
			(_, key) => span(key, "token-key"),
		)
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
): { json: Record<string, unknown> | Record<string, unknown>[]; format: "single" | "array" } {
	switch (type) {
		case "user": {
			const users = generateUsers(count);
			return { json: users as unknown as Record<string, unknown>[], format: "array" };
		}
		case "product": {
			const products = generateProducts(count);
			return { json: products as unknown as Record<string, unknown>[], format: "array" };
		}
		case "api-success": {
			const data = type === "api-success"
				? generateUsers(Math.min(count, 5))
				: [];
			return { json: generateApiSuccessResponse(data), format: "single" };
		}
		case "api-error":
			return { json: generateApiErrorResponse(), format: "single" };
		case "pagination": {
			const data = generateUsers(100);
			const paginated = generatePaginationResponse(data, 1, Math.min(count, 100));
			return { json: paginated as unknown as Record<string, unknown>, format: "single" };
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
	const [generated, setGenerated] = useState(false);
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
		if (!result) return 0;
		if (Array.isArray(result)) return result.length;
		if (result.data && Array.isArray(result.data)) {
			return (result.data as unknown[]).length;
		}
		return 1;
	}, [result]);

	const bytes = useMemo(() => new TextEncoder().encode(output).length, [output]);

	const showCSV = dataType === "user" || dataType === "product";

	function handleGenerate() {
		setIsGenerating(true);
		setGenerated(false);

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

			setGenerated(true);
			setIsGenerating(false);
		}, 0);
	}

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(output);
	}, [output]);

	function handleDownloadJSON() {
		try {
			const data = JSON.parse(output);
			const formatted = JSON.stringify(data, null, 2);
			downloadFile(formatted, `mock-data-${dataType}.json`, "application/json");
		} catch {
			downloadFile(output, `mock-data-${dataType}.json`, "application/json");
		}
	}

	function handleDownloadCSV() {
		if (!output) return;
		downloadFile(output, `mock-data-${dataType}.csv`, "text/csv");
	}

	const isArrayType = dataType === "user" || dataType === "product";
	const isSingleJson = dataType === "edge-cases" || dataType === "api-error";

	const isSingleArray =
		dataType === "pagination" || dataType === "api-success";

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="space-y-2">
					<label
						htmlFor="data-type"
						className="text-sm font-medium text-foreground"
					>
						Tipo de dado
					</label>
					<NativeSelect
						id="data-type"
						value={dataType}
						onChange={(e) => {
							setDataType(e.target.value as MockDataType);
							setGenerated(false);
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

				<div className="space-y-2">
					<label
						htmlFor="quantity"
						className="text-sm font-medium text-foreground"
					>
						Quantidade
					</label>
					<NativeSelect
						id="quantity"
						value={quantity}
						onChange={(e) => {
							setQuantity(Number(e.target.value));
							setGenerated(false);
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

				<div className="space-y-2">
					<label
						htmlFor="output-format"
						className="text-sm font-medium text-foreground"
					>
						Formato de saída
					</label>
					<NativeSelect
						id="output-format"
						value={format}
						onChange={(e) => {
							setFormat(e.target.value as "json" | "csv");
							setGenerated(false);
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

			<div className="flex flex-wrap items-center gap-2">
				<Button
					onClick={handleGenerate}
					disabled={isGenerating}
					size="lg"
				>
					<Shuffle />
					{isGenerating ? "Gerando..." : "Gerar dados"}
				</Button>

				{generated && format === "json" && (isArrayType || isSingleArray) && (
					<div className="flex items-center gap-1 rounded-lg border p-1">
						<button
							type="button"
							onClick={() => {
								setMinified(false);
								if (output) {
									try {
										const parsed = JSON.parse(output);
										setOutput(JSON.stringify(parsed, null, 2));
									} catch { /* ignore */ }
								}
							}}
							className={cn(
								"rounded-md px-3 py-1 text-xs transition-colors",
								!minified
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							Formatado
						</button>
						<button
							type="button"
							onClick={() => {
								setMinified(true);
								if (output) {
									try {
										const parsed = JSON.parse(output);
										setOutput(JSON.stringify(parsed));
									} catch { /* ignore */ }
								}
							}}
							className={cn(
								"rounded-md px-3 py-1 text-xs transition-colors",
								minified
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							Minificado
						</button>
					</div>
				)}
			</div>

			{generated && (
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							{isArrayType && (
								<span className="font-medium text-foreground">
									{recordCount} registro{recordCount !== 1 ? "s" : ""}
								</span>
							)}
							{isArrayType && <span>·</span>}
							<span>{formatBytes(bytes)}</span>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<CopyButton
								text={output}
								label="Copiar"
								variant="outline"
							/>

							{format === "json" && (
								<Button
									onClick={handleDownloadJSON}
									variant="outline"
									size="sm"
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
								>
									<Download />
									Download CSV
								</Button>
							)}
						</div>
					</div>

					<pre
						className={cn(
							"max-h-96 overflow-auto rounded-lg border border-input bg-white p-4 font-mono text-sm text-foreground",
							format === "json" && "json-formatter",
						)}
						dangerouslySetInnerHTML={{
							__html:
								format === "json" ? highlightJSON(output) : escapeHtml(output),
						}}
					/>
				</div>
			)}
		</div>
	);
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}
