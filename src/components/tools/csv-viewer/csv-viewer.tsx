"use client";

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Copy,
	Download,
	Loader2,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LayoutD } from "@/components/shared/layout-d";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";

const ROWS_PER_PAGE = 50;
const AUTO_PARSE_THRESHOLD = 100 * 1024;

type ParsedCsv = {
	headers: string[];
	rows: string[][];
};

type SortConfig = {
	columnIndex: number;
	direction: "asc" | "desc";
} | null;

type ViewerState = "idle" | "parsing" | "done" | "error";

type DelimiterOption = "auto" | "," | ";" | "\t";

function detectDelimiter(text: string): string {
	const firstLine = text.split("\n")[0] ?? "";
	const counts = {
		",": (firstLine.match(/,/g) ?? []).length,
		";": (firstLine.match(/;/g) ?? []).length,
		"\t": (firstLine.match(/\t/g) ?? []).length,
	};
	if (counts["\t"] >= counts[","] && counts["\t"] >= counts[";"]) return "\t";
	if (counts[";"] > counts[","]) return ";";
	return ",";
}

function parseRow(line: string, delimiter: string): string[] {
	const fields: string[] = [];
	let current = "";
	let insideQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === '"') {
			if (insideQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				insideQuotes = !insideQuotes;
			}
		} else if (char === delimiter && !insideQuotes) {
			fields.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	fields.push(current.trim());
	return fields;
}

function parseCsv(text: string, delimiterOverride?: string): ParsedCsv {
	const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
	if (!normalized) throw new Error("O conteúdo está vazio.");

	const delimiter = delimiterOverride ?? detectDelimiter(normalized);
	const lines = normalized.split("\n").filter((line) => line.trim() !== "");

	if (lines.length < 1) {
		throw new Error("Nenhuma linha encontrada.");
	}

	const headers = parseRow(lines[0], delimiter);

	if (headers.length < 2 && !normalized.includes(delimiter)) {
		throw new Error(
			"Não foi possível identificar um delimitador válido. Verifique se o arquivo usa vírgula, ponto e vírgula ou tabulação.",
		);
	}

	const rows: string[][] = [];

	for (let i = 1; i < lines.length; i++) {
		const row = parseRow(lines[i], delimiter);
		if (row.length > 0) rows.push(row);
	}

	return { headers, rows };
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;

	function getPages(): (number | "ellipsis")[] {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		const pages: (number | "ellipsis")[] = [1];
		if (currentPage > 3) pages.push("ellipsis");
		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		if (currentPage < totalPages - 2) pages.push("ellipsis");
		pages.push(totalPages);
		return pages;
	}

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label="Página anterior"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			{getPages().map((page) =>
				page === "ellipsis" ? (
					<span
						key={`ellipsis-${page}`}
						className="px-2 text-sm text-muted-foreground"
						aria-hidden="true"
					>
						...
					</span>
				) : (
					<Button
						key={page}
						variant={page === currentPage ? "default" : "outline"}
						size="sm"
						onClick={() => onPageChange(page)}
						aria-label={`Ir para página ${page}`}
						aria-current={page === currentPage ? "page" : undefined}
					>
						{page}
					</Button>
				),
			)}
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label="Próxima página"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}

export function CsvViewer() {
	const [rawText, setRawText] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [state, setState] = useState<ViewerState>("idle");
	const [errorMsg, setErrorMsg] = useState("");
	const [parsed, setParsed] = useState<ParsedCsv | null>(null);
	const [sortConfig, setSortConfig] = useState<SortConfig>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [delimiterOverride, setDelimiterOverride] =
		useState<DelimiterOption>("auto");
	const [hasHeader, setHasHeader] = useState(true);
	const [isTyping, setIsTyping] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	function runParse(text: string) {
		try {
			const delimiter =
				delimiterOverride === "auto" ? undefined : delimiterOverride;
			const result = parseCsv(text, delimiter);

			if (!hasHeader && result.rows.length === 0 && result.headers.length > 0) {
				const generated = result.headers.map((_, i) => `Coluna ${i + 1}`);
				const allRows = [result.headers, ...result.rows].filter(
					(r) => r.length > 0,
				);
				setParsed({ headers: generated, rows: allRows });
			} else {
				setParsed(result);
			}

			setSortConfig(null);
			setCurrentPage(1);
			setState("done");
		} catch (err) {
			setState("error");
			setErrorMsg(
				err instanceof Error ? err.message : "Erro ao processar o CSV.",
			);
		}
	}

	function tryParse(text: string) {
		const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
		if (normalized.length > AUTO_PARSE_THRESHOLD) return;
		const lines = normalized.split("\n").filter((l) => l.trim());
		if (lines.length < 2) return;

		setState("parsing");
		setTimeout(() => runParse(text), 0);
	}

	function processFile(selected: File) {
		const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
		const hasValidExtension = selected.name.toLowerCase().endsWith(".csv");
		if (!validTypes.includes(selected.type) && !hasValidExtension) {
			setState("error");
			setErrorMsg("O arquivo selecionado não é um CSV válido.");
			return;
		}
		setFile(selected);

		if (selected.size > AUTO_PARSE_THRESHOLD) {
			setState("idle");
			setRawText("");
			return;
		}

		setState("parsing");
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			setRawText(text);
			runParse(text);
		};
		reader.onerror = () => {
			setState("error");
			setErrorMsg("Erro ao ler o arquivo.");
		};
		reader.readAsText(selected, "UTF-8");
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: .
	useEffect(() => {
		if (!rawText.trim()) return;
		const timer = setTimeout(() => {
			setIsTyping(false);
			tryParse(rawText);
		}, 500);
		return () => clearTimeout(timer);
	}, [rawText]);

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	function handleTextChange(value: string) {
		setRawText(value);
		setFile(null);
		if (inputRef.current) inputRef.current.value = "";
		setErrorMsg("");
		if (!value.trim()) {
			setState("idle");
			setParsed(null);
			setIsTyping(false);
		} else {
			setIsTyping(true);
		}
	}

	function handleSort(columnIndex: number) {
		if (!parsed) return;
		setSortConfig((prev) => {
			if (prev?.columnIndex === columnIndex) {
				return {
					columnIndex,
					direction: prev.direction === "asc" ? "desc" : "asc",
				};
			}
			return { columnIndex, direction: "asc" };
		});
		setCurrentPage(1);
	}

	function handleClear() {
		setFile(null);
		setRawText("");
		setState("idle");
		setErrorMsg("");
		setParsed(null);
		setSortConfig(null);
		setCurrentPage(1);
		setIsTyping(false);
		if (inputRef.current) inputRef.current.value = "";
	}

	function handleCopyTable() {
		if (!parsed) return;
		const text = [
			parsed.headers.join(","),
			...parsed.rows.map((r) => r.join(",")),
		].join("\n");
		navigator.clipboard.writeText(text);
	}

	function handleDownload() {
		if (!parsed) return;
		const text = [
			parsed.headers.join(","),
			...parsed.rows.map((r) => r.join(",")),
		].join("\n");
		const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = file ? `visualizado-${file.name}` : "dados.csv";
		link.click();
		URL.revokeObjectURL(link.href);
	}

	function handleCopyJson() {
		if (!parsed) return;
		const json = parsed.rows.map((row) => {
			const obj: Record<string, string> = {};
			parsed.headers.forEach((h, i) => {
				obj[h] = row[i] ?? "";
			});
			return obj;
		});
		navigator.clipboard.writeText(JSON.stringify(json, null, 2));
	}

	function getSortedRows(): string[][] {
		if (!parsed) return [];
		if (!sortConfig) return parsed.rows;
		return [...parsed.rows].sort((a, b) => {
			const valA = a[sortConfig.columnIndex] ?? "";
			const valB = b[sortConfig.columnIndex] ?? "";
			const numA = Number(valA);
			const numB = Number(valB);
			if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
				return sortConfig.direction === "asc" ? numA - numB : numB - numA;
			}
			return sortConfig.direction === "asc"
				? valA.localeCompare(valB, "pt-BR")
				: valB.localeCompare(valA, "pt-BR");
		});
	}

	const sortedRows = getSortedRows();
	const totalPages = Math.ceil(sortedRows.length / ROWS_PER_PAGE);
	const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
	const pageEnd = Math.min(pageStart + ROWS_PER_PAGE, sortedRows.length);
	const visibleRows = sortedRows.slice(pageStart, pageEnd);
	const detectedDelimiter = rawText.trim() ? detectDelimiter(rawText) : "";
	const effectiveDelimiter =
		delimiterOverride === "auto" ? detectedDelimiter : delimiterOverride;
	const fileIsLarge = file !== null && file.size > AUTO_PARSE_THRESHOLD;

	const sidebar = (
		<>
			<SidebarSection title="Contagens">
				<div className="flex items-center justify-between py-0.5">
					<span className="text-xs text-muted-foreground">Linhas</span>
					<span className="font-mono text-xs font-medium tabular-nums">
						{parsed ? parsed.rows.length : "-"}
					</span>
				</div>
				<div className="flex items-center justify-between py-0.5">
					<span className="text-xs text-muted-foreground">Colunas</span>
					<span className="font-mono text-xs font-medium tabular-nums">
						{parsed ? parsed.headers.length : "-"}
					</span>
				</div>
				<div className="flex items-center justify-between py-0.5">
					<span className="text-xs text-muted-foreground">Delimitador</span>
					<span className="font-mono text-xs font-medium tabular-nums">
						{effectiveDelimiter
							? `"${effectiveDelimiter === "\t" ? "\\t" : effectiveDelimiter}"`
							: "-"}
					</span>
				</div>
				<div className="flex items-center justify-between py-0.5">
					<span className="text-xs text-muted-foreground">Tamanho</span>
					<span className="font-mono text-xs font-medium tabular-nums">
						{rawText
							? formatFileSize(new Blob([rawText]).size)
							: file
								? formatFileSize(file.size)
								: "-"}
					</span>
				</div>
			</SidebarSection>

			<SidebarSection title="Opções">
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="delimiter-select"
						className="text-xs text-muted-foreground"
					>
						Delimitador
					</Label>
					<NativeSelect
						id="delimiter-select"
						value={delimiterOverride}
						onChange={(e) =>
							setDelimiterOverride(e.target.value as DelimiterOption)
						}
					>
						<option value="auto">Automático</option>
						<option value=",">Vírgula (,)</option>
						<option value=";">Ponto e vírgula (;)</option>
						<option value={"\t"}>Tabulação (\t)</option>
					</NativeSelect>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						id="has-header"
						checked={hasHeader}
						onCheckedChange={(checked) => setHasHeader(checked === true)}
					/>
					<Label
						htmlFor="has-header"
						className="text-xs text-muted-foreground cursor-pointer"
					>
						Primeira linha como header
					</Label>
				</div>
			</SidebarSection>

			<SidebarSection title="Exportar">
				<Button
					variant="outline"
					size="sm"
					onClick={handleCopyTable}
					disabled={!parsed}
					className="w-full"
				>
					<Copy className="mr-1.5 h-3 w-3" />
					Copiar como CSV
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleCopyJson}
					disabled={!parsed}
					className="w-full"
				>
					<Copy className="mr-1.5 h-3 w-3" />
					Copiar como JSON
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleDownload}
					disabled={!parsed}
					className="w-full"
				>
					<Download className="mr-1.5 h-3 w-3" />
					Baixar CSV
				</Button>
			</SidebarSection>
		</>
	);

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Visualizador de CSV"
					badge={state === "done" ? "PRONTO" : "EM TEMPO REAL"}
					actions={
						<>
							{isTyping && rawText && (
								<Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
							)}
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Limpar"
								onClick={handleClear}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</>
					}
				/>
			}
			sidebar={sidebar}
		>
			{state === "parsing" && (
				<div className="flex items-center justify-center py-12">
					<p className="text-sm text-muted-foreground">Processando...</p>
				</div>
			)}

			{(state === "idle" || state === "error") && (
				<div className="space-y-3 p-4 pb-0">
					{/** biome-ignore lint/a11y/useSemanticElements: dnd */}
					<div
						role="button"
						tabIndex={0}
						aria-label="Área de upload de CSV. Clique ou arraste um arquivo."
						onClick={() => inputRef.current?.click()}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
						}}
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={() => setIsDragging(false)}
						onDrop={handleDrop}
						className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							isDragging
								? "border-primary bg-primary/5"
								: "border-border bg-muted/40 hover:border-primary hover:bg-primary/5"
						}`}
					>
						{file ? (
							<div className="flex items-center gap-3 px-4 text-center">
								<div className="text-left">
									<p className="text-sm font-medium text-foreground">
										{file.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatFileSize(file.size)}
									</p>
								</div>
								<button
									type="button"
									aria-label="Remover arquivo"
									onClick={(e) => {
										e.stopPropagation();
										handleClear();
									}}
									className="rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						) : (
							<>
								<Upload
									className="h-5 w-5 text-muted-foreground"
									strokeWidth={1.75}
								/>
								<p className="text-sm font-medium text-foreground">
									Arraste um arquivo CSV ou clique para selecionar
								</p>
								<p className="text-xs text-muted-foreground">
									Suporta arquivos .csv
								</p>
							</>
						)}
					</div>

					<Input
						ref={inputRef}
						type="file"
						accept=".csv,text/csv"
						onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) processFile(f);
						}}
						className="hidden"
					/>

					{fileIsLarge && (
						<Button
							onClick={() => file && processFile(file)}
							className="w-full"
						>
							Visualizar CSV ({formatFileSize(file.size)})
						</Button>
					)}

					{state === "error" && (
						<p aria-live="polite" className="text-sm text-destructive">
							{errorMsg}
						</p>
					)}
				</div>
			)}

			<div className="p-4">
				<Textarea
					value={rawText}
					onChange={(e) => handleTextChange(e.target.value)}
					placeholder="Cole o CSV aqui... (detecção automática)"
					aria-label="Cole o conteúdo CSV aqui"
					className="resize-y bg-card font-mono text-foreground min-h-[300px]"
				/>
			</div>

			{state === "done" && parsed && (
				<div className="flex flex-col border-t border-border">
					<div className="overflow-x-auto border-b border-border">
						<table className="min-w-full divide-y divide-border text-sm">
							<thead>
								<tr>
									{parsed.headers.map((header, index) => {
										const colKey = header || `Coluna ${index + 1}`;
										return (
											<th
												key={colKey}
												scope="col"
												onClick={() => handleSort(index)}
												className="cursor-pointer select-none whitespace-nowrap bg-muted/40 px-4 py-3 text-left font-semibold text-foreground transition-colors hover:bg-muted/60"
											>
												<div className="flex items-center gap-1.5">
													<span className="max-w-45 truncate" title={header}>
														{header || `Coluna ${index + 1}`}
													</span>
													{sortConfig?.columnIndex === index ? (
														sortConfig.direction === "asc" ? (
															<ArrowUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
														) : (
															<ArrowDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
														)
													) : (
														<ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
													)}
												</div>
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody className="divide-y divide-border bg-card">
								{visibleRows.map((row, rowIndex) => {
									const rowKey = `row-${pageStart + rowIndex}`;
									return (
										<tr key={rowKey} className="even:bg-muted/30">
											{row.map((cell, cellIndex) => {
												const cellKey = `cell-${cellIndex}-${cell.substring(0, 20)}`;
												return (
													<td
														key={cellKey}
														className={`px-4 py-2.5 text-foreground ${
															cellIndex === 0 ? "font-medium" : ""
														}`}
													>
														<span
															className="block max-w-50 truncate"
															title={cell}
														>
															{cell}
														</span>
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-between px-4 py-2">
							<p className="text-sm text-muted-foreground">
								Exibindo {pageStart + 1}–{pageEnd} de {sortedRows.length}
							</p>
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					)}
				</div>
			)}

			<StatusBar
				items={[
					{ label: "", value: "Em tempo real" },
					{
						label: "",
						value: parseStatus(parsed, sortedRows.length),
						mono: true,
					},
					...(parsed && totalPages > 1
						? [
								{
									label: "",
									value: `Pag. ${currentPage}/${totalPages}`,
									mono: true,
								},
							]
						: []),
				]}
				right={
					parsed && (
						<button
							type="button"
							onClick={handleClear}
							className="text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
						>
							Limpar
						</button>
					)
				}
			/>
		</LayoutD>
	);
}

function parseStatus(parsed: ParsedCsv | null, count: number): string {
	if (!parsed) return "";
	return `${count} ${count === 1 ? "linha" : "linhas"} · ${parsed.headers.length} ${parsed.headers.length === 1 ? "coluna" : "colunas"}`;
}
