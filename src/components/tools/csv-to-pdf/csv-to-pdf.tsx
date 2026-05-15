"use client";

import {
	AlertTriangle,
	FileText,
	Loader2,
	RotateCcw,
	Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateCsvPdf } from "@/lib/pdf/csv-to-pdf";
import { downloadPDF } from "@/lib/pdf/merge";
import { cn } from "@/lib/utils";

type ParsedCsv = {
	headers: string[];
	rows: string[][];
	delimiter: string;
};

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

	return { headers, rows, delimiter };
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getOrientationLabel(columnCount: number): string {
	return columnCount > 5 ? "Paisagem (A4)" : "Retrato (A4)";
}

function estimatePages(rowCount: number, columnCount: number): number {
	const rowsPerPage = columnCount > 20 ? 25 : columnCount > 12 ? 35 : 50;
	return Math.max(1, Math.ceil(rowCount / rowsPerPage));
}

const delimiterLabels: Record<string, string> = {
	",": "Vírgula (,)",
	";": "Ponto e vírgula (;)",
	"\t": "Tabulação",
};

const PREVIEW_ROWS = 8;

export function CsvToPdf() {
	const [file, setFile] = useState<File | null>(null);
	const [pasteText, setPasteText] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [fileError, setFileError] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	function processFile(selected: File) {
		const hasValidExtension = selected.name.toLowerCase().endsWith(".csv");
		const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
		if (!validTypes.includes(selected.type) && !hasValidExtension) {
			setFileError("O arquivo selecionado não é um CSV válido.");
			return;
		}
		setFile(selected);
		setFileError("");
		setPasteText("");

		const reader = new FileReader();
		reader.onload = (e) => {
			setPasteText(e.target?.result as string);
		};
		reader.onerror = () => {
			setFileError("Erro ao ler o arquivo.");
		};
		reader.readAsText(selected, "UTF-8");
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	const parsed = useMemo<ParsedCsv | null>(() => {
		const text = pasteText.trim();
		if (!text) return null;
		try {
			return parseCsv(text);
		} catch {
			return null;
		}
	}, [pasteText]);

	const hasError = useMemo(() => {
		const text = pasteText.trim();
		if (!text) return false;
		try {
			parseCsv(text);
			return false;
		} catch (err) {
			return err instanceof Error ? err.message : "Erro ao processar o CSV.";
		}
	}, [pasteText]);

	const fileSize = file?.size ?? 0;
	const previewRows = parsed ? parsed.rows.slice(0, PREVIEW_ROWS) : [];
	const estimatedPages = parsed
		? estimatePages(parsed.rows.length, parsed.headers.length)
		: 0;

	async function handleDownload() {
		if (!parsed) return;
		setIsGenerating(true);
		try {
			const bytes = await generateCsvPdf({
				headers: parsed.headers,
				rows: parsed.rows,
			});
			const baseName = file ? file.name.replace(/\.csv$/i, "") : "tabela";
			downloadPDF(bytes, `${baseName}.pdf`);
		} catch {
			setFileError("Erro ao gerar o PDF. Tente novamente.");
		} finally {
			setIsGenerating(false);
		}
	}

	function handleClear() {
		setFile(null);
		setPasteText("");
		setFileError("");
		setIsGenerating(false);
		if (inputRef.current) inputRef.current.value = "";
	}

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Arquivo CSV</SectionLabel>
						<div className="space-y-3">
							<button
								type="button"
								onClick={() => inputRef.current?.click()}
								onDragOver={(e) => {
									e.preventDefault();
									setIsDragging(true);
								}}
								onDragLeave={() => setIsDragging(false)}
								onDrop={handleDrop}
								className={cn(
									"flex w-full min-h-30 flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer",
									isDragging
										? "border-primary bg-primary/5"
										: "border-border bg-muted/40 hover:border-border-strong",
								)}
							>
								{file ? (
									<div className="flex items-center gap-3">
										<FileText className="h-4 w-4 text-muted-foreground" />
										<div className="text-left">
											<p className="text-sm font-medium text-foreground">
												{file.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatFileSize(file.size)}
											</p>
										</div>
									</div>
								) : (
									<>
										<Upload
											className="h-5 w-5 text-muted-foreground"
											strokeWidth={1.75}
										/>
										<p className="text-sm text-foreground">
											Arraste um arquivo CSV ou clique para selecionar
										</p>
										<p className="text-xs text-muted-foreground">
											.csv · detecção automática de delimitador
										</p>
									</>
								)}
							</button>

							<Input
								ref={inputRef}
								type="file"
								accept=".csv,text/csv"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const f = e.target.files?.[0];
									if (f) processFile(f);
								}}
								className="hidden"
								aria-hidden="true"
							/>

							<div className="space-y-1.5">
								<label
									htmlFor="csv-paste"
									className="text-xs font-medium text-foreground"
								>
									Ou cole o conteúdo CSV
								</label>
								<Textarea
									id="csv-paste"
									value={pasteText}
									onChange={(e) => {
										setPasteText(e.target.value);
										if (file) {
											setFile(null);
											if (inputRef.current) inputRef.current.value = "";
										}
									}}
									placeholder="nome,email,cidade&#10;João,joao@email.com,São Paulo&#10;Maria,maria@email.com,Rio de Janeiro"
									rows={6}
									className="font-mono field-sizing-content min-h-40 max-h-112.5 overflow-y-auto"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
					<span className="text-[11.5px] text-muted-foreground">
						Processamento local · 100% no navegador
					</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClear}
						disabled={!file && !pasteText}
					>
						<RotateCcw className="mr-1.5 h-3 w-3" />
						Limpar
					</Button>
				</div>
			</div>

			<aside className="flex h-full lg:border-l max-lg:border-t flex-col gap-3">
				<div className="flex-1">
					{!parsed && !hasError ? (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<FileText
								className="h-5 w-5 text-muted-foreground"
								strokeWidth={1.75}
							/>
							<p className="text-sm text-muted-foreground">
								Envie um CSV para começar
							</p>
							<p className="text-xs text-muted-foreground">
								Arraste, selecione ou cole o conteúdo
							</p>
						</div>
					) : hasError || fileError ? (
						<div className="p-4.5">
							<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
								<div className="flex items-start gap-2">
									<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
									<p className="text-xs text-destructive">
										{hasError || fileError}
									</p>
								</div>
							</div>
						</div>
					) : parsed ? (
						<>
							<div className="p-4.5 bg-card border-b">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										PDF pronto
									</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<span>{getOrientationLabel(parsed.headers.length)}</span>
									<span>·</span>
									<span className="font-mono">{estimatedPages} páginas</span>
								</div>
							</div>

							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhes
								</p>
								<ResultRow
									label="Linhas"
									value={parsed.rows.length.toLocaleString("pt-BR")}
								/>
								<ResultRow
									label="Colunas"
									value={parsed.headers.length.toLocaleString("pt-BR")}
								/>
								<ResultRow
									label="Delimitador"
									value={
										<span className="font-mono">
											{delimiterLabels[parsed.delimiter] ?? parsed.delimiter}
										</span>
									}
								/>
								{fileSize > 0 && (
									<ResultRow
										label="Tamanho"
										value={
											<span className="font-mono">
												{formatFileSize(fileSize)}
											</span>
										}
									/>
								)}
								<ResultRow label="Páginas est." value={estimatedPages} />
							</div>

							<div className="border-t border-border">
								<div className="px-4.5 pt-3 pb-1">
									<p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										Prévia
									</p>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full text-[11px]">
										<thead>
											<tr className="bg-muted/40">
												{parsed.headers.map((header, i) => (
													<th
														// biome-ignore lint/suspicious/noArrayIndexKey: static list
														key={header + i}
														scope="col"
														className="whitespace-nowrap px-3 py-2 text-left font-semibold text-foreground"
													>
														<span
															className="block max-w-30 truncate"
															title={header}
														>
															{header || `Col ${i + 1}`}
														</span>
													</th>
												))}
											</tr>
										</thead>
										<tbody className="divide-y divide-border">
											{previewRows.map((row, ri) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: static list
												<tr key={ri} className="even:bg-muted/30">
													{row.map((cell, ci) => (
														<td
															// biome-ignore lint/suspicious/noArrayIndexKey: static list
															key={ci}
															className="whitespace-nowrap px-3 py-1.5 text-foreground"
														>
															<span
																className="block max-w-30 truncate"
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
								{parsed.rows.length > PREVIEW_ROWS && (
									<div className="px-4.5 py-2 text-center text-caption text-muted-foreground border-t border-border">
										{parsed.rows.length - PREVIEW_ROWS} linhas ocultas ·{" "}
										{parsed.rows.length} total
									</div>
								)}
							</div>

							<div className="flex gap-2 border-t border-border px-4.5 py-3">
								<Button
									onClick={handleDownload}
									disabled={isGenerating}
									className="flex-1 gap-2"
								>
									{isGenerating ? (
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
									) : null}
									{isGenerating ? "Gerando..." : "Baixar PDF"}
								</Button>
							</div>
						</>
					) : null}
				</div>

				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Todos os dados são processados localmente no navegador. Nenhum
						arquivo é enviado a servidores externos.
					</span>
				</div>
			</aside>
		</div>
	);
}
