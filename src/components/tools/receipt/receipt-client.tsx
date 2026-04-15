"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { exportReceiptPdf } from "@/lib/receipt/export";
import { ReceiptActions } from "./receipt-actions";
import { ReceiptForm, receiptSchema } from "./receipt-form";
import { ReceiptPreview } from "./receipt-preview";

export type ReceiptFormValues = {
	nomePagador: string;
	nomeRecebedor: string;
	valor: number;
	descricao?: string;
	data: string;
	cidade?: string;
	formaPagamento?:
		| "Dinheiro"
		| "Pix"
		| "Transferência"
		| "Cartão"
		| "Cheque"
		| "Outro";
};

function getTodayIso(): string {
	return new Date().toISOString().split("T")[0];
}

const emptyValues = (): ReceiptFormValues => ({
	nomePagador: "",
	nomeRecebedor: "",
	valor: undefined as unknown as number,
	descricao: "",
	data: getTodayIso(),
	cidade: "",
	formaPagamento: undefined,
});

export function ReceiptClient() {
	const [isExporting, setIsExporting] = useState(false);

	const form = useForm<ReceiptFormValues>({
		resolver: zodResolver(receiptSchema) as Resolver<ReceiptFormValues>,
		defaultValues: emptyValues(),
	});

	const watchedValues = form.watch();

	async function handleExport(values: ReceiptFormValues) {
		setIsExporting(true);
		try {
			await exportReceiptPdf(values);
		} finally {
			setIsExporting(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-4">
					<Form {...form}>
						<ReceiptForm control={form.control} form={form} />
					</Form>
					<div className="flex justify-end">
						<button
							type="button"
							onClick={() => form.reset(emptyValues())}
							className="text-sm text-muted-foreground underline-offset-4 hover:underline"
						>
							Limpar
						</button>
					</div>
				</div>

				<div className="space-y-4">
					<ReceiptPreview values={watchedValues} />
					<ReceiptActions
						values={form.formState.isValid ? watchedValues : null}
						isExporting={isExporting}
						onExport={() => form.handleSubmit(handleExport)()}
					/>
				</div>
			</div>
		</div>
	);
}
