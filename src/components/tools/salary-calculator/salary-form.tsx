"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { parseCurrencyToNumber } from "@/utils/number";
import type { CalculateResult } from "./types";
import { calculateSalary } from "./utils";

const salaryFormSchema = z.object({
	grossSalary: z.string().min(1, "Informe o salário bruto"),
	dependents: z.coerce
		.number({ message: "Informe o número de dependentes" })
		.min(0, "O valor mínimo é 0"),
	otherDiscounts: z.string().optional(),
	benefits: z.string().optional(),
});

type SalaryCalculatorFormProps = {
	onCalculate: (data: CalculateResult) => void;
};

type SalaryFormValues = z.infer<typeof salaryFormSchema>;

export function SalaryCalculatorForm(props: SalaryCalculatorFormProps) {
	const { onCalculate } = props;

	const form = useForm<SalaryFormValues>({
		resolver: zodResolver(salaryFormSchema) as Resolver<SalaryFormValues>,
		defaultValues: {
			grossSalary: "",
			dependents: 0,
			otherDiscounts: "",
			benefits: "",
		},
	});

	function onSubmit(data: SalaryFormValues) {
		const grossSalary = parseCurrencyToNumber(data.grossSalary);
		const dependents = data.dependents || 0;
		const otherDiscounts = parseCurrencyToNumber(data.otherDiscounts || "0");
		const benefits = parseCurrencyToNumber(data.benefits || "0");

		const result = calculateSalary({
			grossSalary,
			benefits,
			dependents,
			otherDiscounts,
		});

		onCalculate(result);
	}

	function handleCurrencyInputChange(
		name: keyof SalaryFormValues,
		_numberValue: number,
		maskedValue: string,
	) {
		form.setValue(name, maskedValue, { shouldValidate: true });
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl"
			>
				<FormField
					control={form.control}
					name="grossSalary"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Salário Bruto*</FormLabel>
								<Popover>
									<PopoverTrigger className="text-gray-500">
										<Info size={16} />
									</PopoverTrigger>
									<PopoverContent className="w-60 text-sm">
										Valor total do salário antes dos descontos de INSS, IRRF e
										outros. É o valor do salário assinado em carteira.
									</PopoverContent>
								</Popover>
							</div>
							<FormControl>
								<CurrencyInput
									onChangeValue={(_, numberValue, maskedValue) =>
										handleCurrencyInputChange(
											"grossSalary",
											numberValue as number,
											maskedValue as string,
										)
									}
									value={form.getValues("grossSalary")}
									InputElement={
										<Input type="text" placeholder="R$" {...field} />
									}
								/>
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
							<div className="flex items-center justify-between">
								<FormLabel>Número de dependentes</FormLabel>
								<Popover>
									<PopoverTrigger className="text-gray-500">
										<Info size={16} />
									</PopoverTrigger>
									<PopoverContent className="w-60 text-sm">
										Dependentes legais do trabalhador. Usados para cálculo de
										benefícios do imposto de renda.
									</PopoverContent>
								</Popover>
							</div>
							<FormControl>
								<Input type="number" min={0} placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="otherDiscounts"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Outros descontos</FormLabel>
								<Popover>
									<PopoverTrigger className="text-gray-500">
										<Info size={16} />
									</PopoverTrigger>
									<PopoverContent className="w-60 text-sm">
										Informe valores como vale-transporte, empréstimos, pensões
										ou contribuições adicionais.
									</PopoverContent>
								</Popover>
							</div>
							<FormControl>
								<CurrencyInput
									onChangeValue={(_, numberValue, maskedValue) =>
										handleCurrencyInputChange(
											"otherDiscounts",
											numberValue as number,
											maskedValue as string,
										)
									}
									value={form.getValues("otherDiscounts")}
									InputElement={
										<Input type="text" placeholder="R$" {...field} />
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="benefits"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Benefícios</FormLabel>
								<Popover>
									<PopoverTrigger className="text-gray-500">
										<Info size={16} />
									</PopoverTrigger>
									<PopoverContent className="w-60 text-sm">
										Inclua valores extras além do salário bruto, como
										vale-alimentação, bônus, ajudas de custo entre outros.
									</PopoverContent>
								</Popover>
							</div>
							<FormControl>
								<CurrencyInput
									onChangeValue={(_, numberValue, maskedValue) =>
										handleCurrencyInputChange(
											"benefits",
											numberValue as number,
											maskedValue as string,
										)
									}
									value={form.getValues("benefits")}
									InputElement={
										<Input type="text" placeholder="R$" {...field} />
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Calcular salário líquido</Button>
			</form>
		</Form>
	);
}
