"use client";

import {
	formatLocationLine,
	formatReceiptBody,
	formatValor,
} from "@/lib/receipt/format";
import type { ReceiptFormValues } from "./receipt-client";

type ReceiptPreviewProps = {
	values: ReceiptFormValues;
};

export function ReceiptPreview({ values }: ReceiptPreviewProps) {
	const isEmpty = !values.nomePagador.trim() || !values.valor;

	if (isEmpty) {
		return (
			<div className="flex min-h-100 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
				<p className="text-sm text-muted-foreground">
					Preencha os campos obrigatórios para visualizar o recibo
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-border bg-white p-10 shadow-sm">
			<div className="space-y-6 font-[Arial,Helvetica,sans-serif] text-foreground">
				<div className="text-center">
					<h2 className="text-2xl font-bold tracking-widest text-foreground font-[Arial,Helvetica,sans-serif]!">
						RECIBO
					</h2>
				</div>

				<hr className="border-border" />

				<p className="text-sm leading-relaxed text-foreground">
					{formatReceiptBody(values)}
				</p>

				{values.formaPagamento && (
					<p className="text-xs text-muted-foreground">
						Forma de pagamento: {values.formaPagamento}
					</p>
				)}

				<div className="pt-4">
					<p className="text-sm text-foreground">
						{formatLocationLine(values)}
					</p>
				</div>

				<div className="pt-6">
					<div className="w-56 border-t border-foreground pt-2">
						<p className="text-sm text-foreground">{values.nomeRecebedor}</p>
					</div>
				</div>

				<div className="flex justify-end">
					<p className="text-xs text-muted-foreground">
						R$ {formatValor(values.valor)}
					</p>
				</div>
			</div>
		</div>
	);
}
