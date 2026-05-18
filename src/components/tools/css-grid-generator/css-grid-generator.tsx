"use client";

import { Link, Minus, Plus, RotateCcw, Unlink, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	buildFullCSS,
	COLUMN_PRESETS,
	DEFAULT_GRID_CONFIG,
	GRID_PRESETS,
	type GridTrack,
	ROW_PRESETS,
} from "@/lib/css/grid";
import { cn } from "@/lib/utils";

function makeid(): string {
	return Math.random().toString(36).slice(2, 9);
}

function TrackRow({
	index,
	track,
	presets,
	onChange,
	onRemove,
	canRemove,
	ariaLabel,
}: {
	index: number;
	track: GridTrack;
	presets: readonly string[];
	onChange: (value: string) => void;
	onRemove: () => void;
	canRemove: boolean;
	ariaLabel: string;
}) {
	const isPreset = (presets as readonly string[]).includes(track.value);

	return (
		<div className="space-y-1.5">
			<div className="flex items-center gap-1.5">
				<span className="text-xs font-medium">{index + 1} -</span>
				<div className="flex flex-wrap gap-1 flex-1">
					{presets.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => onChange(p)}
							className={cn(
								"rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium transition-colors",
								track.value === p
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							{p}
						</button>
					))}
				</div>
				{canRemove && (
					<button
						type="button"
						onClick={onRemove}
						aria-label={ariaLabel}
						className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				)}
			</div>
			<Input
				type="text"
				value={track.value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={isPreset ? "" : "ex: minmax(100px, 1fr)"}
				className="h-7 text-xs font-mono"
			/>
		</div>
	);
}

export function CssGridGenerator() {
	const [columns, setColumns] = useState<GridTrack[]>(
		DEFAULT_GRID_CONFIG.columns,
	);
	const [rows, setRows] = useState<GridTrack[]>(DEFAULT_GRID_CONFIG.rows);
	const [columnGap, setColumnGap] = useState(DEFAULT_GRID_CONFIG.columnGap);
	const [rowGap, setRowGap] = useState(DEFAULT_GRID_CONFIG.rowGap);
	const [gapLinked, setGapLinked] = useState(DEFAULT_GRID_CONFIG.gapLinked);
	const [cellCount, setCellCount] = useState(6);

	const config = useMemo(
		() => ({ columns, rows, columnGap, rowGap, gapLinked }),
		[columns, rows, columnGap, rowGap, gapLinked],
	);

	const cssCode = useMemo(() => buildFullCSS(config), [config]);

	const containerStyle: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: columns.map((c) => c.value || "1fr").join(" "),
		gridTemplateRows: rows.map((r) => r.value || "auto").join(" "),
		...(gapLinked
			? { gap: `${rowGap}px` }
			: { columnGap: `${columnGap}px`, rowGap: `${rowGap}px` }),
		padding: "8px",
		minHeight: "120px",
	};

	function updateColumn(id: string, value: string) {
		setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
	}

	function removeColumn(id: string) {
		if (columns.length <= 1) return;
		setColumns((prev) => prev.filter((c) => c.id !== id));
	}

	function addColumn() {
		if (columns.length >= 12) return;
		setColumns((prev) => [...prev, { id: makeid(), value: "1fr" }]);
	}

	function updateRow(id: string, value: string) {
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
	}

	function removeRow(id: string) {
		if (rows.length <= 1) return;
		setRows((prev) => prev.filter((r) => r.id !== id));
	}

	function addRow() {
		if (rows.length >= 8) return;
		setRows((prev) => [...prev, { id: makeid(), value: "auto" }]);
	}

	function applyPreset(preset: (typeof GRID_PRESETS)[number]) {
		setColumns(preset.columns.map((v) => ({ id: makeid(), value: v })));
		setRows(preset.rows.map((v) => ({ id: makeid(), value: v })));
		setColumnGap(preset.columnGap);
		setRowGap(preset.rowGap);
		setGapLinked(preset.columnGap === preset.rowGap);
		setCellCount(preset.columns.length * preset.rows.length);
	}

	function reset() {
		setColumns(DEFAULT_GRID_CONFIG.columns);
		setRows(DEFAULT_GRID_CONFIG.rows);
		setColumnGap(DEFAULT_GRID_CONFIG.columnGap);
		setRowGap(DEFAULT_GRID_CONFIG.rowGap);
		setGapLinked(DEFAULT_GRID_CONFIG.gapLinked);
		setCellCount(6);
	}

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Colunas
						</h3>
						<div className="space-y-3">
							{columns.map((col, i) => (
								<TrackRow
									index={i}
									key={col.id}
									track={col}
									presets={COLUMN_PRESETS}
									onChange={(v) => updateColumn(col.id, v)}
									onRemove={() => removeColumn(col.id)}
									canRemove={columns.length > 1}
									ariaLabel={`Remover coluna ${i + 1}`}
								/>
							))}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={addColumn}
							disabled={columns.length >= 12}
							className="h-7 w-full text-xs text-muted-foreground hover:text-foreground"
						>
							<Plus className="h-3 w-3 mr-1" />
							Adicionar coluna
						</Button>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Linhas
						</h3>
						<div className="space-y-3">
							{rows.map((row, i) => (
								<TrackRow
									index={i}
									key={row.id}
									track={row}
									presets={ROW_PRESETS}
									onChange={(v) => updateRow(row.id, v)}
									onRemove={() => removeRow(row.id)}
									canRemove={rows.length > 1}
									ariaLabel={`Remover linha ${i + 1}`}
								/>
							))}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={addRow}
							disabled={rows.length >= 8}
							className="h-7 w-full text-xs text-muted-foreground hover:text-foreground"
						>
							<Plus className="h-3 w-3 mr-1" />
							Adicionar linha
						</Button>
					</div>

					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Gap
							</h3>
							<button
								type="button"
								onClick={() => {
									if (!gapLinked) updateColumn; // no-op align
									setGapLinked((v) => !v);
									if (gapLinked === false) setColumnGap(rowGap);
								}}
								className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
								title={gapLinked ? "Separar row/column gap" : "Vincular gaps"}
							>
								{gapLinked ? (
									<Link className="h-3 w-3" />
								) : (
									<Unlink className="h-3 w-3" />
								)}
								{gapLinked ? "vinculado" : "separado"}
							</button>
						</div>

						{gapLinked ? (
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-[11px] text-muted-foreground">
										row + column
									</span>
									<span className="font-mono text-[11px] text-muted-foreground">
										{rowGap}px
									</span>
								</div>
								<Slider
									min={0}
									max={64}
									step={1}
									value={[rowGap]}
									onValueChange={([v]) => {
										setRowGap(v);
										setColumnGap(v);
									}}
								/>
							</div>
						) : (
							<div className="space-y-2">
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-[11px] text-muted-foreground">
											column-gap
										</span>
										<span className="font-mono text-[11px] text-muted-foreground">
											{columnGap}px
										</span>
									</div>
									<Slider
										min={0}
										max={64}
										step={1}
										value={[columnGap]}
										onValueChange={([v]) => setColumnGap(v)}
									/>
								</div>
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-[11px] text-muted-foreground">
											row-gap
										</span>
										<span className="font-mono text-[11px] text-muted-foreground">
											{rowGap}px
										</span>
									</div>
									<Slider
										min={0}
										max={64}
										step={1}
										value={[rowGap]}
										onValueChange={([v]) => setRowGap(v)}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between px-4 py-3 border-b border-border">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Preview
						</h3>
						<div className="flex items-center gap-2">
							<span className="font-mono text-[11px] text-muted-foreground">
								{columns.length} col · {rows.length} lin
							</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={reset}
								className="h-6 text-[11px] text-muted-foreground hover:text-foreground px-2"
							>
								<RotateCcw className="h-3 w-3 mr-1" />
								Resetar
							</Button>
						</div>
					</div>

					<div
						className="flex-1 p-4"
						role="img"
						aria-label={`Prévia do CSS Grid com ${columns.length} colunas e ${rows.length} linhas`}
					>
						<div style={containerStyle}>
							{Array.from({ length: cellCount }, (_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: lista fixa
									key={i}
									className="flex items-center justify-center bg-primary/10 border border-primary/20 rounded-[3px] font-mono text-xs text-primary"
									style={{ minHeight: "50px" }}
								>
									{i + 1}
								</div>
							))}
						</div>
					</div>

					<div className="border-t border-border px-4 py-3 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Células
							</h3>
							<div className="flex items-center gap-1.5">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCellCount((v) => Math.max(1, v - 1))}
									disabled={cellCount <= 1}
									className="h-6 w-6"
									aria-label="Remover célula"
								>
									<Minus className="h-3 w-3" />
								</Button>
								<span className="font-mono text-xs text-foreground w-5 text-center">
									{cellCount}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCellCount((v) => Math.min(24, v + 1))}
									disabled={cellCount >= 24}
									className="h-6 w-6"
									aria-label="Adicionar célula"
								>
									<Plus className="h-3 w-3" />
								</Button>
							</div>
						</div>

						<div className="space-y-1.5">
							<span className="text-[11px] text-muted-foreground">Presets</span>
							<div className="grid grid-cols-2 gap-1">
								{GRID_PRESETS.map((preset) => (
									<Button
										key={preset.label}
										type="button"
										onClick={() => applyPreset(preset)}
										title={preset.description}
										size="sm"
										variant="secondary"
									>
										{preset.label}
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Código CSS
							</h3>
							<CopyButton text={cssCode} />
						</div>
						<pre className="font-mono text-[11px] leading-relaxed bg-muted/20 p-3 rounded-md border border-border overflow-x-auto whitespace-pre-wrap">
							{cssCode}
						</pre>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Uso
						</h3>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Aplique a classe{" "}
							<code className="font-mono bg-muted px-1 rounded">
								.container
							</code>{" "}
							no elemento pai. Os filhos diretos serão os itens do grid.
						</p>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Para posicionamento específico, use{" "}
							<code className="font-mono bg-muted px-1 rounded">
								grid-column
							</code>{" "}
							e{" "}
							<code className="font-mono bg-muted px-1 rounded">grid-row</code>{" "}
							nos itens filhos.
						</p>
					</div>
				</div>
			}
		/>
	);
}
