"use client";

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Upload,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ROWS_PER_PAGE = 50;

type ParsedCsv = {
	headers: string[];
	rows: string[][];
};

type SortConfig = {
	columnIndex: number;
	direction: "asc" | "desc";
} | null;

type ViewerState = "idle" | "parsing" | "done" | "error";

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

function parseCsv(text: string): ParsedCsv {
	const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
	if (!normalized) throw new Error("O conteúdo está vazio.");

	const delimiter = detectDelimiter(normalized);
	const lines = normalized.split("\n").filter((line) => line.trim() !== "");

	if (lines.length < 2) {
		throw new Error(
			"O CSV precisa ter pelo menos um cabeçalho e uma linha de dados.",
		);
	}

	const headers = parseRow(lines[0], delimiter);

	if (headers.length < 2 && !normalized.includes(delimiter)) {
		throw new Error(
			"Não foi possível identificar um delimitador válido. Verifique se o arquivo usa vírgula, ponto e vírgula ou tabulação.",
		);
	}

	const rows: string[][] = [];
	const invalidLines: number[] = [];

	for (let i = 1; i < lines.length; i++) {
		const row = parseRow(lines[i], delimiter);
		if (row.length !== headers.length) {
			invalidLines.push(i + 1);
		} else {
			rows.push(row);
		}
	}

	if (rows.length === 0) {
		throw new Error("Nenhuma linha de dados válida encontrada.");
	}

	if (invalidLines.length > 0 && invalidLines.length === lines.length - 1) {
		throw new Error(
			"Todas as linhas têm número de colunas diferente do cabeçalho. Verifique o delimitador ou a estrutura do arquivo.",
		);
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
						key={`ellipsis-${page.toString()}`}
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
	const [file, setFile] = useState<File | null>(null);
	const [pasteText, setPasteText] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [state, setState] = useState<ViewerState>("idle");
	const [errorMsg, setErrorMsg] = useState("");
	const [parsed, setParsed] = useState<ParsedCsv | null>(null);
	const [sortConfig, setSortConfig] = useState<SortConfig>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [skippedRows, setSkippedRows] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	function processFile(selected: File) {
		const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
		const hasValidExtension = selected.name.toLowerCase().endsWith(".csv");
		if (!validTypes.includes(selected.type) && !hasValidExtension) {
			setState("error");
			setErrorMsg("O arquivo selecionado não é um CSV válido.");
			return;
		}
		setFile(selected);
		setState("idle");
		setErrorMsg("");
		setParsed(null);
		setSortConfig(null);
		setCurrentPage(1);
		setPasteText("");
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	function handlePreview() {
		setState("parsing");
		setErrorMsg("");

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const text = e.target?.result as string;
					runParse(text);
				} catch {
					setState("error");
					setErrorMsg("Não foi possível ler o arquivo.");
				}
			};
			reader.onerror = () => {
				setState("error");
				setErrorMsg("Erro ao ler o arquivo.");
			};
			reader.readAsText(file, "UTF-8");
			return;
		}

		if (pasteText.trim()) {
			runParse(pasteText);
			return;
		}

		setState("error");
		setErrorMsg(
			"Selecione um arquivo ou cole o conteúdo CSV antes de visualizar.",
		);
	}

	function runParse(text: string) {
		try {
			const result = parseCsv(text);

			const normalized = text
				.replace(/\r\n/g, "\n")
				.replace(/\r/g, "\n")
				.trim();
			const delimiter = detectDelimiter(normalized);
			const lines = normalized.split("\n").filter((line) => line.trim() !== "");
			const headerLength = parseRow(lines[0], delimiter).length;
			let skipped = 0;
			for (let i = 1; i < lines.length; i++) {
				if (parseRow(lines[i], delimiter).length !== headerLength) skipped++;
			}

			setSkippedRows(skipped);
			setParsed(result);
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

	function handleSort(columnIndex: number) {
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
		setPasteText("");
		setState("idle");
		setErrorMsg("");
		setParsed(null);
		setSortConfig(null);
		setCurrentPage(1);
		setSkippedRows(0);
		if (inputRef.current) inputRef.current.value = "";
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
	const hasContent = file !== null || pasteText.trim() !== "";

	return (
		<div className="space-y-4">
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
				className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
					isDragging
						? "border-primary bg-primary/5"
						: "border-border bg-secondary hover:border-primary hover:bg-primary/5"
				}`}
			>
				{file ? (
					<div className="flex items-center gap-3 px-4 text-center">
						<div className="text-left">
							<p className="text-sm font-medium text-foreground">{file.name}</p>
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
						<Upload className="h-8 w-8 text-muted-foreground" />
						<p className="text-sm font-medium text-foreground">
							Arraste um arquivo CSV ou clique para selecionar
						</p>
						<p className="text-xs text-muted-foreground">
							Suporta arquivos .csv
						</p>
					</>
				)}
			</div>

			<input
				ref={inputRef}
				type="file"
				accept=".csv,text/csv"
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) processFile(f);
				}}
				className="hidden"
			/>

			<div className="relative">
				<Textarea
					value={pasteText}
					onChange={(e) => {
						setPasteText(e.target.value);
						if (file) {
							setFile(null);
							if (inputRef.current) inputRef.current.value = "";
						}
						setState("idle");
						setErrorMsg("");
					}}
					placeholder="Ou cole o CSV aqui..."
					rows={5}
					aria-label="Cole o conteúdo CSV aqui"
					className="resize-y bg-card font-mono text-foreground"
				/>
			</div>

			{state === "error" && (
				<p aria-live="polite" className="text-sm text-destructive">
					{errorMsg}
				</p>
			)}

			{skippedRows > 0 && state === "done" && (
				<p aria-live="polite" className="text-sm text-warning">
					{skippedRows}{" "}
					{skippedRows === 1 ? "linha ignorada" : "linhas ignoradas"} por ter
					número de colunas diferente do cabeçalho.
				</p>
			)}

			<Button
				onClick={handlePreview}
				disabled={!hasContent || state === "parsing"}
				className="w-full"
			>
				{state === "parsing" ? "Processando..." : "Visualizar CSV"}
			</Button>

			{state === "done" && parsed && (
				<div className="space-y-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-muted-foreground">
							<span className="font-medium text-foreground">
								{parsed.rows.length}
							</span>{" "}
							{parsed.rows.length === 1 ? "linha" : "linhas"} ×{" "}
							<span className="font-medium text-foreground">
								{parsed.headers.length}
							</span>{" "}
							{parsed.headers.length === 1 ? "coluna" : "colunas"}
							{parsed.rows.length > 10000 && (
								<span className="ml-2 text-warning">
									(arquivo grande — desempenho pode variar)
								</span>
							)}
						</p>
						<div className="flex items-center gap-3">
							<p className="text-sm text-muted-foreground">
								Exibindo {pageStart + 1}–{pageEnd} de {sortedRows.length}
							</p>
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					</div>

					<div className="overflow-x-auto rounded-lg border border-border">
						<table className="min-w-full divide-y divide-border text-sm">
							<thead>
								<tr>
									{parsed.headers.map((header, index) => (
										<th
											// biome-ignore lint/suspicious/noArrayIndexKey: "Índice é estável para colunas em um arquivo CSV"
											key={index}
											scope="col"
											onClick={() => handleSort(index)}
											className="cursor-pointer select-none whitespace-nowrap bg-primary px-4 py-3 text-left font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
										>
											<div className="flex items-center gap-1.5">
												<span className="max-w-45 truncate" title={header}>
													{header || `Coluna ${index + 1}`}
												</span>
												{sortConfig?.columnIndex === index ? (
													sortConfig.direction === "asc" ? (
														<ArrowUp className="h-3.5 w-3.5 shrink-0" />
													) : (
														<ArrowDown className="h-3.5 w-3.5 shrink-0" />
													)
												) : (
													<ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
												)}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-border bg-card">
								{visibleRows.map((row, rowIndex) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: "Índice é estável para linhas em uma página"
									<tr key={rowIndex} className="even:bg-secondary/50">
										{row.map((cell, cellIndex) => (
											<td
												// biome-ignore lint/suspicious/noArrayIndexKey: "Índice é estável para células em uma linha"
												key={cellIndex}
												className={`px-4 py-2.5 text-foreground ${
													cellIndex === 0 ? "font-medium" : ""
												}`}
											>
												<span className="block max-w-50 truncate" title={cell}>
													{cell}
												</span>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-between">
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

					<Button
						variant="outline"
						size="sm"
						onClick={handleClear}
						className="w-full sm:w-auto"
					>
						Limpar e começar novamente
					</Button>
				</div>
			)}
		</div>
	);
}
