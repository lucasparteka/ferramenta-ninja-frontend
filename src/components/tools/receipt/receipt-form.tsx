"use client";

import { CurrencyInput } from "react-currency-mask";
import type { Control, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import type { ReceiptFormValues } from "./receipt-client";

export const receiptSchema = z.object({
	nomePagador: z.string().min(1, "Informe o nome do pagador"),
	nomeRecebedor: z.string().min(1, "Informe o nome do recebedor"),
	valor: z.coerce
		.number({ message: "Informe o valor" })
		.positive("O valor deve ser maior que zero"),
	descricao: z.string().optional(),
	data: z.string().min(1, "Informe a data"),
	cidade: z.string().optional(),
	formaPagamento: z
		.enum(["Dinheiro", "Pix", "Transferência", "Cartão", "Cheque", "Outro"])
		.optional(),
});

const FORMAS_PAGAMENTO = [
	"Dinheiro",
	"Pix",
	"Transferência",
	"Cartão",
	"Cheque",
	"Outro",
] as const;

type ReceiptFormProps = {
	control: Control<ReceiptFormValues>;
	form: UseFormReturn<ReceiptFormValues, unknown, ReceiptFormValues>;
};

export function ReceiptForm({ control, form }: ReceiptFormProps) {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					control={control}
					name="nomePagador"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome do pagador *</FormLabel>
							<FormControl>
								<Input placeholder="Ex: João da Silva" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="nomeRecebedor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome do recebedor *</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Maria Oliveira" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={control}
				name="valor"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Valor (R$) *</FormLabel>
						<FormControl>
							<CurrencyInput
								onChangeValue={(_, originalValue) => {
									form.setValue("valor", originalValue as number);
								}}
								value={form.getValues("valor")}
								InputElement={<Input type="text" placeholder="R$" {...field} />}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="descricao"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Descrição</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Ex: serviços prestados de pintura"
								rows={3}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					control={control}
					name="data"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Data</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="cidade"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cidade</FormLabel>
							<FormControl>
								<Input placeholder="Ex: São Paulo - SP" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={control}
				name="formaPagamento"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Forma de pagamento</FormLabel>
						<FormControl>
							<NativeSelect
								{...field}
								value={field.value ?? ""}
								onChange={(e) => {
									const val = e.target.value;
									field.onChange(val || undefined);
								}}
							>
								<option value="">Selecione</option>
								{FORMAS_PAGAMENTO.map((forma) => (
									<option key={forma} value={forma}>
										{forma}
									</option>
								))}
							</NativeSelect>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
