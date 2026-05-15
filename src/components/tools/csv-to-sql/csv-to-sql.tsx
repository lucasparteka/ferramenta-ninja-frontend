"use client";

import { Download, FileUp, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";

type Dialect = "mysql" | "postgresql" | "sqlite" | "oracle" | "sqlserver";

const DIALECTS: { id: Dialect; label: string }[] = [
	{ id: "mysql", label: "MySQL" },
	{ id: "postgresql", label: "PostgreSQL" },
	{ id: "sqlite", label: "SQLite" },
	{ id: "oracle", label: "Oracle" },
	{ id: "sqlserver", label: "SQL Server" },
];

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

function parseCsv(text: string) {
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

function quoteIdentifier(name: string, dialect: Dialect): string {
	switch (dialect) {
		case "mysql":
			return `\`${name.replace(/`/g, "``")}\``;
		case "sqlserver":
			return `[${name.replace(/\]/g, "]]")}]`;
		default:
			return `"${name.replace(/"/g, '""')}"`;
	}
}

function isNumericValue(value: string): boolean {
	return value !== "" && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value.trim());
}

function quoteValue(value: string, treatEmptyAsNull: boolean): string {
	if (treatEmptyAsNull && value === "") return "NULL";
	if (isNumericValue(value)) return value.trim();
	return `'${value.replace(/'/g, "''")}'`;
}

function getColumnType(dialect: Dialect): string {
	switch (dialect) {
		case "oracle":
			return "VARCHAR2(4000)";
		case "sqlserver":
			return "NVARCHAR(MAX)";
		default:
			return "TEXT";
	}
}

function generateSql(
	tableName: string,
	headers: string[],
	rows: string[][],
	dialect: Dialect,
	includeCreateTable: boolean,
	treatEmptyAsNull: boolean,
): string {
	const qi = (name: string) => quoteIdentifier(name, dialect);
	const qv = (v: string) => quoteValue(v, treatEmptyAsNull);

	const safeTableName = tableName.trim() || "my_table";
	const tableRef = qi(safeTableName);
	const columnList = headers.map(qi).join(", ");
	const columnType = getColumnType(dialect);

	const parts: string[] = [];

	if (includeCreateTable) {
		const columnDefs = headers
			.map((h) => `  ${qi(h)} ${columnType}`)
			.join(",\n");
		parts.push(`CREATE TABLE ${tableRef} (\n${columnDefs}\n);`);
		parts.push("");
	}

	const inserts = rows
		.map((row) => {
			const values = row.map(qv).join(", ");
			return `INSERT INTO ${tableRef} (${columnList}) VALUES (${values});`;
		})
		.join("\n");

	parts.push(inserts);

	return parts.join("\n");
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CsvToSql() {
	const [pasteText, setPasteText] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [tableName, setTableName] = useState("my_table");
	const [dialect, setDialect] = useState<Dialect>("mysql");
	const [includeCreateTable, setIncludeCreateTable] = useState(true);
	const [treatEmptyAsNull, setTreatEmptyAsNull] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const hasContent = pasteText.trim() !== "";

	const result = useMemo(() => {
		if (!hasContent) return { sql: "", error: null, rows: 0, timeMs: 0 };
		const start = performance.now();
		try {
			const parsed = parseCsv(pasteText);
			const generated = generateSql(
				tableName,
				parsed.headers,
				parsed.rows,
				dialect,
				includeCreateTable,
				treatEmptyAsNull,
			);
			return {
				sql: generated,
				error: null,
				rows: parsed.rows.length,
				timeMs: performance.now() - start,
			};
		} catch (err) {
			return {
				sql: "",
				error: err instanceof Error ? err.message : "Erro ao processar o CSV.",
				rows: 0,
				timeMs: 0,
			};
		}
	}, [
		pasteText,
		dialect,
		tableName,
		includeCreateTable,
		treatEmptyAsNull,
		hasContent,
	]);

	function handleFile(selected: File) {
		const hasValidExtension = selected.name.toLowerCase().endsWith(".csv");
		const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
		if (!validTypes.includes(selected.type) && !hasValidExtension) {
			setPasteText("");
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			setPasteText(text);
		};
		reader.readAsText(selected, "UTF-8");
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) handleFile(dropped);
	}

	function handleClear() {
		setPasteText("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleDownload() {
		const safeTableName = tableName.trim() || "my_table";
		const blob = new Blob([result.sql], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${safeTableName}.sql`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const sqlBytes = result.sql ? new TextEncoder().encode(result.sql).length : 0;
	const dialectLabel = DIALECTS.find((d) => d.id === dialect)?.label ?? "";

	return (
		<LayoutC
			toolbar={
				<div className="flex flex-col gap-3 w-full">
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label
								htmlFor="dialect-select"
								className="text-xs font-medium text-foreground"
							>
								Dialeto SQL
							</Label>
							<NativeSelect
								id="dialect-select"
								value={dialect}
								onChange={(e) => setDialect(e.target.value as Dialect)}
							>
								{DIALECTS.map((d) => (
									<option key={d.id} value={d.id}>
										{d.label}
									</option>
								))}
							</NativeSelect>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="table-name"
								className="text-xs font-medium text-foreground"
							>
								Nome da tabela
							</Label>
							<Input
								id="table-name"
								type="text"
								value={tableName}
								onChange={(e) => setTableName(e.target.value)}
								placeholder="my_table"
								className="font-mono text-sm"
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-4">
						<div className="flex items-center gap-2">
							<Checkbox
								id="include-create"
								checked={includeCreateTable}
								onCheckedChange={(v) => setIncludeCreateTable(v === true)}
							/>
							<Label
								htmlFor="include-create"
								className="text-xs cursor-pointer"
							>
								Incluir CREATE TABLE
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="empty-as-null"
								checked={treatEmptyAsNull}
								onCheckedChange={(v) => setTreatEmptyAsNull(v === true)}
							/>
							<Label htmlFor="empty-as-null" className="text-xs cursor-pointer">
								Tratar campos vazios como NULL
							</Label>
						</div>
					</div>
				</div>
			}
			left={
				<>
					<PaneHeader
						title="Entrada · CSV"
						actions={
							<>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => fileInputRef.current?.click()}
									aria-label="Carregar arquivo"
								>
									<FileUp className="h-3.5 w-3.5" />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={handleClear}
									disabled={!hasContent}
									aria-label="Limpar"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							</>
						}
					/>
					{!hasContent ? (
						<button
							type="button"
							aria-label="Área de upload de CSV"
							onClick={() => fileInputRef.current?.click()}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
							className={cn(
								"flex-1 min-h-70 flex flex-col items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer",
								isDragging
									? "border-primary bg-primary/5"
									: "border-border bg-muted/40",
							)}
						>
							<FileUp
								className="h-5 w-5 text-muted-foreground"
								strokeWidth={1.75}
							/>
							<p className="text-sm text-foreground">
								Cole o CSV ou arraste um arquivo
							</p>
							<p className="text-xs text-muted-foreground">
								.csv · detecção automática de delimitador
							</p>
						</button>
					) : (
						<textarea
							value={pasteText}
							onChange={(e) => setPasteText(e.target.value)}
							placeholder="Cole o CSV aqui..."
							className="flex-1 min-h-70 resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
							spellCheck={false}
						/>
					)}
					<Input
						ref={fileInputRef}
						type="file"
						accept=".csv,text/csv"
						onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) handleFile(f);
						}}
						className="hidden"
						aria-hidden="true"
					/>
				</>
			}
			right={
				<>
					<PaneHeader
						title={
							<>
								Saída · SQL
								{result.sql && (
									<span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success">
										Pronto
									</span>
								)}
							</>
						}
						actions={
							<>
								<CopyButton
									text={result.sql}
									disabled={!result.sql}
									variant="ghost"
									size="icon-sm"
									iconOnly
								/>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={handleDownload}
									disabled={!result.sql}
									aria-label="Baixar .sql"
								>
									<Download className="h-3.5 w-3.5" />
								</Button>
							</>
						}
					/>
					<div className="flex-1 min-h-70 bg-muted/20 p-3">
						{result.error ? (
							<p className="text-xs text-destructive">{result.error}</p>
						) : result.sql ? (
							<pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all select-all">
								{result.sql}
							</pre>
						) : (
							<p className="text-sm text-muted-foreground">
								{hasContent ? "Processando..." : "O SQL gerado aparecerá aqui"}
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
							value: result.error
								? "Erro"
								: result.sql
									? `Pronto em ${result.timeMs.toFixed(1)}ms`
									: hasContent
										? "Processando..."
										: "Aguardando",
							mono: false,
							variant: result.error
								? "danger"
								: result.sql
									? "success"
									: "default",
						},
						{
							label: "Entrada",
							value: hasContent ? `${pasteText.length} chars` : "0",
							mono: true,
						},
						{
							label: "Saída",
							value: result.rows
								? `${result.rows} linhas · ${formatFileSize(sqlBytes)}`
								: "0",
							mono: true,
						},
					]}
					right={
						<span className="font-mono text-[11px] text-muted-foreground">
							{dialectLabel}
						</span>
					}
				/>
			}
		/>
	);
}
