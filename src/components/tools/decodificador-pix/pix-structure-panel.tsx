"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { crc16Ccitt, type EmvField, formatFieldValue } from "@/lib/pix/decode";
import { cn } from "@/lib/utils";

type ViewMode = "tree" | "json" | "raw";

export function PixStructurePanel({
	fields,
	raw,
}: {
	fields: EmvField[];
	raw: string;
}) {
	const [mode, setMode] = useState<ViewMode>("tree");

	const tabs: { id: ViewMode; label: string }[] = [
		{ id: "tree", label: "Árvore" },
		{ id: "json", label: "JSON" },
		{ id: "raw", label: "Raw" },
	];

	return (
		<div className="flex flex-col h-full">
			<div className="flex border-b border-border">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setMode(tab.id)}
						className={cn(
							"px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none -mb-px border-b-2",
							mode === tab.id
								? "border-primary text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="flex-1 overflow-auto p-3">
				{mode === "tree" && <EmvTree fields={fields} />}
				{mode === "json" && <JsonView fields={fields} />}
				{mode === "raw" && <RawView raw={raw} />}
			</div>
		</div>
	);
}

function EmvTree({ fields }: { fields: EmvField[] }) {
	if (fields.length === 0) {
		return (
			<div className="py-8 text-center text-xs text-muted-foreground">
				Nenhum campo decodificado
			</div>
		);
	}
	return (
		<div className="space-y-1">
			{fields.map((field, i) => (
				<EmvTreeNode
					// biome-ignore lint/suspicious/noArrayIndexKey: tree structure uses index for uniqueness
					key={`root-${field.id}-${field.value}-${i}`}
					field={field}
				/>
			))}
		</div>
	);
}

function EmvTreeNode({
	field,
	depth = 0,
}: {
	field: EmvField;
	depth?: number;
}) {
	const [expanded, setExpanded] = useState(true);
	const hasChildren = field.children && field.children.length > 0;

	const content = (
		<>
			{hasChildren && (
				<span className="mt-0.5 font-mono text-xs text-muted-foreground">
					{expanded ? "[-]" : "[+]"}
				</span>
			)}
			<div className="flex-1 min-w-0 space-y-1">
				<div className="flex flex-wrap items-center gap-2">
					<span className="inline-flex items-center rounded bg-muted px-1.5 py-px font-mono text-[10px] font-semibold">
						ID: {field.id}
					</span>
					<span className="inline-flex items-center rounded bg-muted px-1.5 py-px font-mono text-[10px]">
						Len: {field.length}
					</span>
					<span className="text-xs font-medium">{field.name}</span>
				</div>
				{!hasChildren && (
					<code className="block break-all rounded bg-muted/40 px-2 py-1 text-xs font-mono">
						{formatFieldValue(field.id, field.value)}
					</code>
				)}
			</div>
		</>
	);

	return (
		<div
			className={cn(
				"border-l-2 border-border pl-3",
				depth === 0 && "border-l-0 pl-0",
			)}
		>
			{hasChildren ? (
				<button
					type="button"
					className="flex w-full items-start gap-2 py-1.5 px-2 rounded-md transition-colors text-left hover:bg-muted/50"
					onClick={() => setExpanded(!expanded)}
				>
					{content}
				</button>
			) : (
				<div className="flex items-start gap-2 py-1.5 px-2">{content}</div>
			)}
			{hasChildren && expanded && (
				<div className="mt-1">
					{field.children!.map((child, i) => (
						<EmvTreeNode
							// biome-ignore lint/suspicious/noArrayIndexKey: tree structure uses index for uniqueness
							key={`${child.id}-${child.value}-${i}`}
							field={child}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function JsonView({ fields }: { fields: EmvField[] }) {
	const text = JSON.stringify(fields, null, 2);
	return (
		<div className="relative">
			<CopyButton
				text={text}
				iconOnly
				className="absolute top-2 right-2 z-10"
				variant="ghost"
				size="xs"
			/>
			<pre className="rounded-md bg-muted/60 p-3 text-xs font-mono overflow-auto max-h-[400px]">
				{text}
			</pre>
		</div>
	);
}

function RawView({ raw }: { raw: string }) {
	const crcIdx = raw.lastIndexOf("6304");
	const crcProvided =
		crcIdx !== -1 ? raw.substring(crcIdx + 4, crcIdx + 8) : null;
	const crcCalculated =
		crcIdx !== -1 ? crc16Ccitt(raw.substring(0, crcIdx + 4)) : null;
	const isValid = crcProvided
		? crcProvided.toUpperCase() === crcCalculated
		: false;

	return (
		<div className="space-y-4">
			<div>
				<h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
					Payload Original
				</h4>
				<code className="block break-all rounded-md bg-muted/40 p-3 text-xs font-mono">
					{raw}
				</code>
			</div>
			<div>
				<h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
					CRC Info
				</h4>
				<div className="rounded-md bg-muted/40 p-3 text-xs font-mono space-y-1">
					<div>CRC Encontrado: {crcProvided || "N/A"}</div>
					<div>CRC Calculado: {crcCalculated || "N/A"}</div>
					<div>
						Válido:{" "}
						<span className={isValid ? "text-success" : "text-destructive"}>
							{isValid ? "Sim" : "Não"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
