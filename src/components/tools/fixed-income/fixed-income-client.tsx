"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import {
	ResultBox,
	ResultGrid,
	ResultRow,
} from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import {
	calculateFixedIncome,
	type FixedIncomeResult,
	type IndexType,
} from "@/lib/finance/fixed-income";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	principal: z.string().min(1, "Informe o valor"),
	days: z.coerce.number().min(1, "Mínimo 1 dia").max(7300, "Máximo 20 anos"),
	kind: z.enum(["cdb", "lci-lca", "tesouro-selic"]),
	indexType: z.enum(["cdi", "selic", "prefixed"]),
	annualIndexRate: z.coerce.number().min(0),
	indexPercentage: z.coerce.number().min(0).max(300),
	prefixedAnnualRate: z.coerce.number().min(0).max(100),
});

type FormValues = z.infer<typeof schema>;

export function FixedIncomeClient() {
	const [result, setResult] = useState<FixedIncomeResult | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			principal: "",
			days: 365,
			kind: "cdb",
			indexType: "cdi",
			annualIndexRate: 11.25,
			indexPercentage: 100,
			prefixedAnnualRate: 12,
		},
	});

	const indexType = form.watch("indexType");

	function onSubmit(data: FormValues) {
		const r = calculateFixedIncome({
			principal: parseCurrencyToNumber(data.principal),
			days: data.days,
			annualIndexRate: data.annualIndexRate / 100,
			indexPercentage: data.indexPercentage,
			prefixedAnnualRate: data.prefixedAnnualRate / 100,
			kind: data.kind,
			indexType: data.indexType as IndexType,
		});
		setResult(r);
	}

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 max-w-xl"
				>
					<FormField
						control={form.control}
						name="principal"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Valor aplicado</FormLabel>
								<FormControl>
									<CurrencyInput
										value={field.value}
										onChangeValue={(_, __, masked) =>
											field.onChange(masked as string)
										}
										InputElement={
											<Input type="text" placeholder="R$ 0,00" {...field} />
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="days"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prazo (dias corridos)</FormLabel>
									<FormControl>
										<Input type="number" min={1} max={7300} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="kind"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de aplicação</FormLabel>
									<FormControl>
										<NativeSelect {...field}>
											<option value="cdb">CDB</option>
											<option value="lci-lca">LCI/LCA (isento)</option>
											<option value="tesouro-selic">Tesouro Selic</option>
										</NativeSelect>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="indexType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Indexador</FormLabel>
								<FormControl>
									<NativeSelect {...field}>
										<option value="cdi">CDI</option>
										<option value="selic">Selic</option>
										<option value="prefixed">Prefixado</option>
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{indexType !== "prefixed" ? (
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="annualIndexRate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Taxa anual do {indexType === "cdi" ? "CDI" : "Selic"} (%)
										</FormLabel>
										<FormControl>
											<Input type="number" step="0.01" min={0} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="indexPercentage"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Percentual do indexador (%)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min={0}
												max={300}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					) : (
						<FormField
							control={form.control}
							name="prefixedAnnualRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Taxa prefixada anual (%)</FormLabel>
									<FormControl>
										<Input type="number" step="0.01" min={0} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<Button type="submit">Calcular rendimento</Button>
				</form>
			</Form>

			{result && <ResultCard result={result} />}
		</div>
	);
}

function ResultCard({ result }: { result: FixedIncomeResult }) {
	return (
		<div className="space-y-4">
			<ResultBox
				label="Valor líquido final"
				value={brl(result.netFinal)}
				hint={`Rentabilidade líquida anual equivalente: ${(result.effectiveAnnualRate * 100).toFixed(2)}%`}
			/>
			<ResultGrid>
				<ResultRow label="Rendimento bruto" value={brl(result.grossYield)} />
				<ResultRow label="Valor bruto final" value={brl(result.grossFinal)} />
				<ResultRow
					label={`IOF (${(result.iofRate * 100).toFixed(0)}%)`}
					value={brl(result.iof)}
				/>
				<ResultRow
					label={`IR (${(result.irRate * 100).toFixed(2)}%)`}
					value={brl(result.ir)}
				/>
				<ResultRow label="Rendimento líquido" value={brl(result.netYield)} />
			</ResultGrid>
		</div>
	);
}

function brl(value: number): string {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}
