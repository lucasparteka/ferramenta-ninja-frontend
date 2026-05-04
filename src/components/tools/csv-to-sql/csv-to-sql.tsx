"use client";

import { Download, Trash, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Dialect = "mysql" | "postgresql" | "sqlite" | "oracle" | "sqlserver";
type ToolState = "idle" | "converting" | "done" | "error";

type ParsedCsv = {
	headers: string[];
	rows: string[][];
};

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

function OptionCheckbox({
	id,
	label,
	checked,
	onChange,
}: {
	id: string;
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<div className="flex items-center gap-2">
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={(v) => onChange(v === true)}
			/>
			<label
				htmlFor={id}
				className="cursor-pointer select-none text-sm text-foreground"
			>
				{label}
			</label>
		</div>
	);
}

export function CsvToSql() {
	const [file, setFile] = useState<File | null>(null);
	const [pasteText, setPasteText] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [state, setState] = useState<ToolState>("idle");
	const [errorMsg, setErrorMsg] = useState("");
	const [sql, setSql] = useState("");
	const [rowCount, setRowCount] = useState(0);

	const [tableName, setTableName] = useState("my_table");
	const [dialect, setDialect] = useState<Dialect>("mysql");
	const [includeCreateTable, setIncludeCreateTable] = useState(true);
	const [treatEmptyAsNull, setTreatEmptyAsNull] = useState(false);
	const [parsedData, setParsedData] = useState<ParsedCsv | null>(null);

	const inputRef = useRef<HTMLInputElement>(null);

	function regenerateSql(
		data: ParsedCsv,
		newDialect: Dialect,
		newTableName: string,
		newIncludeCreateTable: boolean,
		newTreatEmptyAsNull: boolean,
	) {
		const result = generateSql(
			newTableName,
			data.headers,
			data.rows,
			newDialect,
			newIncludeCreateTable,
			newTreatEmptyAsNull,
		);
		setSql(result);
	}

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
		setSql("");
		setPasteText("");
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	function runConvert(text: string) {
		try {
			const parsed = parseCsv(text);
			const result = generateSql(
				tableName,
				parsed.headers,
				parsed.rows,
				dialect,
				includeCreateTable,
				treatEmptyAsNull,
			);
			setSql(result);
			setRowCount(parsed.rows.length);
			setParsedData(parsed);
			setState("done");
		} catch (err) {
			setState("error");
			setErrorMsg(
				err instanceof Error ? err.message : "Erro ao processar o CSV.",
			);
		}
	}

	function handleConvert() {
		setState("converting");
		setErrorMsg("");
		setSql("");

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					runConvert(e.target?.result as string);
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
			runConvert(pasteText);
			return;
		}

		setState("error");
		setErrorMsg(
			"Selecione um arquivo ou cole o conteúdo CSV antes de continuar.",
		);
	}

	function handleDownload() {
		const safeTableName = tableName.trim() || "my_table";
		const blob = new Blob([sql], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${safeTableName}.sql`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleClear() {
		setFile(null);
		setPasteText("");
		setState("idle");
		setErrorMsg("");
		setSql("");
		setRowCount(0);
		setParsedData(null);
		if (inputRef.current) inputRef.current.value = "";
	}

	const hasContent = file !== null || pasteText.trim() !== "";
	const isBusy = state === "converting";

	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<label
						htmlFor="table-name"
						className="text-sm font-medium text-foreground"
					>
						Nome da tabela
					</label>
					<Input
						id="table-name"
						type="text"
						value={tableName}
						onChange={(e) => setTableName(e.target.value)}
						placeholder="my_table"
						onBlur={() => {
							if (state === "done" && parsedData) {
								regenerateSql(
									parsedData,
									dialect,
									tableName,
									includeCreateTable,
									treatEmptyAsNull,
								);
							}
						}}
					/>
				</div>

				<div className="space-y-1.5">
					<p className="text-sm font-medium text-foreground">Dialeto SQL</p>
					<div className="flex flex-wrap gap-1.5">
						{DIALECTS.map((d) => (
							<button
								key={d.id}
								type="button"
								onClick={() => {
									setDialect(d.id);
									if (state === "done" && parsedData) {
										regenerateSql(
											parsedData,
											d.id,
											tableName,
											includeCreateTable,
											treatEmptyAsNull,
										);
									}
								}}
								className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
									dialect === d.id
										? "bg-primary text-primary-foreground"
										: "border border-border bg-card text-foreground hover:border-primary hover:text-primary"
								}`}
							>
								{d.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-4">
				<OptionCheckbox
					id="include-create"
					label="Incluir CREATE TABLE"
					checked={includeCreateTable}
					onChange={(v) => {
						setIncludeCreateTable(v);
						if (state === "done" && parsedData) {
							regenerateSql(
								parsedData,
								dialect,
								tableName,
								v,
								treatEmptyAsNull,
							);
						}
					}}
				/>
				<OptionCheckbox
					id="empty-as-null"
					label="Tratar campos vazios como NULL"
					checked={treatEmptyAsNull}
					onChange={(v) => {
						setTreatEmptyAsNull(v);
						if (state === "done" && parsedData) {
							regenerateSql(
								parsedData,
								dialect,
								tableName,
								includeCreateTable,
								v,
							);
						}
					}}
				/>
			</div>

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
					setSql("");
				}}
				placeholder="Ou cole o CSV aqui..."
				rows={5}
				aria-label="Cole o conteúdo CSV aqui"
				className="resize-y font-mono"
			/>

			{state === "error" && (
				<p aria-live="polite" className="text-sm text-destructive">
					{errorMsg}
				</p>
			)}

			{state !== "done" && (
				<Button
					onClick={handleConvert}
					disabled={!hasContent || isBusy}
					className="w-full"
				>
					{isBusy ? "Convertendo..." : "Converter para SQL"}
				</Button>
			)}

			{state === "done" && sql && (
				<div className="space-y-3">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm text-muted-foreground">
							<span className="font-medium text-foreground">{rowCount}</span>{" "}
							{rowCount === 1 ? "linha convertida" : "linhas convertidas"} →{" "}
							<span className="font-medium text-foreground">
								{DIALECTS.find((d) => d.id === dialect)?.label}
							</span>
						</p>
						<div className="flex gap-2">
							<CopyButton text={sql} label="Copiar SQL" />
							<Button
								variant="outline"
								onClick={handleDownload}
								className="gap-2"
							>
								<Download className="h-4 w-4" />
								Baixar .sql
							</Button>
						</div>
					</div>

					<Textarea
						readOnly
						value={sql}
						aria-label="SQL gerado"
						rows={16}
						className="resize-y font-mono text-xs"
					/>

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
