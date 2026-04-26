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
	type ChristmasBonusResult,
	calculateChristmasBonus,
} from "@/lib/labor/christmas-bonus";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	salary: z.string().min(1, "Informe o salário bruto"),
	monthsWorked: z.coerce
		.number()
		.min(1, "Mínimo 1 mês")
		.max(12, "Máximo 12 meses"),
	dependents: z.coerce.number().min(0),
	additional: z.string().optional(),
	firstInstallmentTiming: z.enum(["november", "vacation"]),
});

type FormValues = z.infer<typeof schema>;

export function ChristmasBonusCalculatorClient() {
	const [result, setResult] = useState<ChristmasBonusResult | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			salary: "",
			monthsWorked: 12,
			dependents: 0,
			additional: "",
			firstInstallmentTiming: "november",
		},
	});

	function onSubmit(data: FormValues) {
		const r = calculateChristmasBonus({
			monthlySalary: parseCurrencyToNumber(data.salary),
			monthsWorked: data.monthsWorked,
			dependents: data.dependents,
			averageAdditional: parseCurrencyToNumber(data.additional ?? ""),
			firstInstallmentTiming: data.firstInstallmentTiming,
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
						name="salary"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Salário bruto mensal</FormLabel>
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

					<FormField
						control={form.control}
						name="monthsWorked"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Meses trabalhados no ano</FormLabel>
								<FormControl>
									<Input type="number" min={1} max={12} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dependents"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Dependentes</FormLabel>
								<FormControl>
									<Input type="number" min={0} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="additional"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Média de adicionais habituais (opcional)</FormLabel>
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

					<FormField
						control={form.control}
						name="firstInstallmentTiming"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pagamento da 1ª parcela</FormLabel>
								<FormControl>
									<NativeSelect {...field}>
										<option value="november">
											Até 30 de novembro (padrão)
										</option>
										<option value="vacation">
											Adiantar junto às férias (Lei 4.749/65 art. 2º §2º)
										</option>
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular 13º</Button>
				</form>
			</Form>

			{result && <ResultCard result={result} />}
		</div>
	);
}

function ResultCard({ result }: { result: ChristmasBonusResult }) {
	return (
		<div className="space-y-4">
			<ResultBox label="13º líquido total" value={brl(result.netTotal)} />
			<ResultGrid>
				<ResultRow label="13º bruto" value={brl(result.grossBonus)} />
				<ResultRow label="Avos" value={`${result.avos}/12`} />
				<ResultRow
					label={
						result.firstInstallmentTiming === "vacation"
							? "1ª parcela (junto às férias)"
							: "1ª parcela (até 30/nov)"
					}
					value={brl(result.firstInstallment)}
				/>
				<ResultRow
					label="2ª parcela (até 20/dez)"
					value={brl(result.secondInstallment)}
				/>
				<ResultRow label="INSS" value={brl(result.inss)} />
				<ResultRow label="IRRF" value={brl(result.irrf)} />
			</ResultGrid>
			<p className="text-xs text-muted-foreground">
				{result.firstInstallmentDueLabel}
			</p>
		</div>
	);
}

function brl(value: number): string {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}
