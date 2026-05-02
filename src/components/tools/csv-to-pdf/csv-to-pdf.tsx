"use client";

import {
	AlignJustify,
	ChevronLeft,
	ChevronRight,
	Columns,
	FileDown,
	Trash,
	Upload,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateCsvPdf } from "@/lib/pdf/csv-to-pdf";
import { downloadPDF } from "@/lib/pdf/merge";

const ROWS_PER_PAGE = 50;

type ParsedCsv = {
	headers: string[];
	rows: string[][];
};

type ToolState = "idle" | "parsing" | "preview" | "generating" | "error";

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
	for (let i = 1; i < lines.length; i++) {
		const row = parseRow(lines[i], delimiter);
		if (row.length === headers.length) rows.push(row);
	}

	if (rows.length === 0)
		throw new Error("Nenhuma linha de dados válida encontrada.");

	return { headers, rows };
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getOrientationLabel(columnCount: number): string {
	return columnCount > 5 ? "Paisagem (A4)" : "Retrato (A4)";
}

function getColumnGroupInfo(columnCount: number): string | null {
	if (columnCount <= 20) return null;
	const approxCols = columnCount > 20 ? Math.ceil(columnCount / 10) : null;
	if (!approxCols) return null;
	return `CSV com muitas colunas — o PDF será gerado em ${approxCols} seções horizontais, cada uma contendo todas as linhas`;
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
		if (totalPages <= 7)
			return Array.from({ length: totalPages }, (_, i) => i + 1);
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
			{getPages().map((page, index) =>
				page === "ellipsis" ? (
					<span
						key={`ellipsis-${index}`}
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

export function CsvToPdf() {
	const [file, setFile] = useState<File | null>(null);
	const [pasteText, setPasteText] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [state, setState] = useState<ToolState>("idle");
	const [errorMsg, setErrorMsg] = useState("");
	const [parsed, setParsed] = useState<ParsedCsv | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const inputRef = useRef<HTMLInputElement>(null);

	function processFile(selected: File) {
		const hasValidExtension = selected.name.toLowerCase().endsWith(".csv");
		const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
		if (!validTypes.includes(selected.type) && !hasValidExtension) {
			setState("error");
			setErrorMsg("O arquivo selecionado não é um CSV válido.");
			return;
		}
		setFile(selected);
		setState("idle");
		setErrorMsg("");
		setParsed(null);
		setCurrentPage(1);
		setPasteText("");
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	function handleParse() {
		setState("parsing");
		setErrorMsg("");

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					runParse(e.target?.result as string);
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
			"Selecione um arquivo ou cole o conteúdo CSV antes de continuar.",
		);
	}

	function runParse(text: string) {
		try {
			const result = parseCsv(text);
			setParsed(result);
			setCurrentPage(1);
			setState("preview");
		} catch (err) {
			setState("error");
			setErrorMsg(
				err instanceof Error ? err.message : "Erro ao processar o CSV.",
			);
		}
	}

	async function handleDownload() {
		if (!parsed) return;
		setState("generating");
		try {
			const bytes = await generateCsvPdf({
				headers: parsed.headers,
				rows: parsed.rows,
			});
			const baseName = file ? file.name.replace(/\.csv$/i, "") : "tabela";
			downloadPDF(bytes, `${baseName}.pdf`);
			setState("preview");
		} catch {
			setState("error");
			setErrorMsg("Erro ao gerar o PDF. Tente novamente.");
		}
	}

	function handleClear() {
		setFile(null);
		setPasteText("");
		setState("idle");
		setErrorMsg("");
		setParsed(null);
		setCurrentPage(1);
		if (inputRef.current) inputRef.current.value = "";
	}

	const hasContent = file !== null || pasteText.trim() !== "";
	const isBusy = state === "parsing" || state === "generating";

	const totalPages = parsed ? Math.ceil(parsed.rows.length / ROWS_PER_PAGE) : 0;
	const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
	const pageEnd = parsed
		? Math.min(pageStart + ROWS_PER_PAGE, parsed.rows.length)
		: 0;
	const visibleRows = parsed ? parsed.rows.slice(pageStart, pageEnd) : [];

	return (
		<div className="space-y-4">
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
					<div className="flex items-center gap-3 px-4">
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

			<Input
				ref={inputRef}
				type="file"
				accept=".csv,text/csv"
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) processFile(f);
				}}
				className="hidden"
				aria-hidden="true"
			/>

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

			{state === "error" && (
				<p aria-live="polite" className="text-sm text-destructive">
					{errorMsg}
				</p>
			)}

			{state !== "preview" && state !== "generating" && (
				<Button
					onClick={handleParse}
					disabled={!hasContent || isBusy}
					className="w-full"
				>
					{state === "parsing" ? "Processando..." : "Visualizar CSV"}
				</Button>
			)}

			{(state === "preview" || state === "generating") && parsed && (
				<div className="space-y-5">
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
							<AlignJustify className="h-4 w-4 shrink-0" />
							<span>
								<span className="font-medium text-foreground">
									{parsed.rows.length}
								</span>{" "}
								{parsed.rows.length === 1 ? "linha" : "linhas"} ×{" "}
								<span className="font-medium text-foreground">
									{parsed.headers.length}
								</span>{" "}
								{parsed.headers.length === 1 ? "coluna" : "colunas"}
							</span>
						</div>
						<div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
							<Columns className="h-4 w-4 shrink-0" />
							<span>{getOrientationLabel(parsed.headers.length)}</span>
						</div>
					</div>

					{getColumnGroupInfo(parsed.headers.length) && (
						<p className="text-sm text-muted-foreground">
							{getColumnGroupInfo(parsed.headers.length)}
						</p>
					)}

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<Button
							onClick={handleDownload}
							disabled={state === "generating"}
							className="gap-2 sm:w-auto"
						>
							<FileDown className="h-4 w-4" />
							{state === "generating" ? "Gerando PDF..." : "Baixar como PDF"}
						</Button>

						{totalPages > 1 && (
							<div className="flex items-center gap-3">
								<p className="text-sm text-muted-foreground">
									Exibindo {pageStart + 1}–{pageEnd} de {parsed.rows.length}
								</p>
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
								/>
							</div>
						)}
					</div>

					<div className="overflow-x-auto rounded-lg border border-border">
						<table className="min-w-full divide-y divide-border text-sm">
							<thead>
								<tr>
									{parsed.headers.map((header, index) => (
										<th
											key={index}
											scope="col"
											className="whitespace-nowrap bg-primary px-4 py-3 text-left font-semibold text-primary-foreground"
										>
											<span
												className="block max-w-[180px] truncate"
												title={header}
											>
												{header || `Coluna ${index + 1}`}
											</span>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-border bg-card">
								{visibleRows.map((row, rowIndex) => (
									<tr key={rowIndex} className="even:bg-secondary/50">
										{row.map((cell, cellIndex) => (
											<td
												key={cellIndex}
												className={`px-4 py-2.5 text-foreground ${cellIndex === 0 ? "font-medium" : ""}`}
											>
												<span
													className="block max-w-[200px] truncate"
													title={cell}
												>
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
								Exibindo {pageStart + 1}–{pageEnd} de {parsed.rows.length}
							</p>
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					)}

					<Button
						variant="secondary"
						onClick={handleClear}
						className="w-full sm:w-auto"
					>
						<Trash />
						Limpar e começar novamente
					</Button>
				</div>
			)}
		</div>
	);
}
