"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import { formatBRL, type PixInfo } from "@/lib/pix/decode";

type Row = {
	label: string;
	value: string;
	mono?: boolean;
	isUrl?: boolean;
};

export function PixInfoPanel({ pixInfo }: { pixInfo: PixInfo }) {
	const rows: Row[] = [
		{
			label: "Tipo",
			value: pixInfo.type === "dynamic" ? "Dinâmico" : "Estático",
		},
		{
			label: "Código de Categoria",
			value: pixInfo.merchantCategoryCode || "-",
		},
		{ label: "Moeda", value: pixInfo.transactionCurrency?.toString() || "-" },
		{ label: "Código do País", value: pixInfo.countryCode || "-" },
		{ label: "Nome do Beneficiário", value: pixInfo.merchantName || "-" },
		{ label: "Cidade do Beneficiário", value: pixInfo.merchantCity || "-" },
		{
			label: "Valor",
			value: pixInfo.amount
				? formatBRL(Number.parseFloat(pixInfo.amount))
				: "-",
		},
		{ label: "Uso Único", value: pixInfo.oneTime ? "Sim" : "Não" },
		...(pixInfo.key
			? [{ label: "Chave PIX", value: pixInfo.key, mono: true }]
			: []),
		...(pixInfo.txid
			? [{ label: "TXID", value: pixInfo.txid, mono: true }]
			: []),
		...(pixInfo.url
			? [{ label: "URL", value: pixInfo.url, mono: true, isUrl: true }]
			: []),
	];

	return (
		<div className="divide-y divide-border">
			{rows.map((row) => (
				<div
					key={row.label}
					className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:items-center sm:gap-4"
				>
					<span className="min-w-[160px] text-xs text-muted-foreground sm:w-44 shrink-0">
						{row.label}
					</span>
					<span className="flex items-center gap-2 text-xs break-all">
						{row.isUrl && row.value !== "-" ? (
							<a
								href={
									row.value.startsWith("http")
										? row.value
										: `https://${row.value}`
								}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								{row.value}
							</a>
						) : (
							<span className={cn(row.mono && "font-mono")}>{row.value}</span>
						)}
						{row.value && row.value !== "-" && (
							<CopyButton text={row.value} iconOnly size="xs" variant="ghost" />
						)}
					</span>
				</div>
			))}
		</div>
	);
}
