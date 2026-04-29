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
import { NativeSelect } from "@/components/ui/select-native";
import { parseCurrencyToNumber } from "@/utils/number";
import type { CalculateNightAllowanceResult } from "./types";
import { calculateNightAllowance } from "./utils";

const nightAllowanceFormSchema = z.object({
	grossSalary: z.string().min(1, "Informe o salário bruto"),
	contractualHours: z.coerce
		.number({ message: "Informe as horas contratuais" })
		.min(1, "O valor mínimo é 1"),
	workedHours: z.coerce
		.number({ message: "Informe as horas trabalhadas" })
		.min(0, "O valor mínimo é 0"),
	minutes: z.coerce
		.number({ message: "Informe os minutos" })
		.min(0, "O valor mínimo é 0")
		.max(59, "O valor máximo é 59"),
	percentageAllowance: z.coerce
		.number({ message: "Informe o percentual" })
		.min(0, "O valor mínimo é 0"),
	usefulDays: z.coerce
		.number({ message: "Informe os dias úteis" })
		.min(1, "O valor mínimo é 1"),
	holidaysAndSundays: z.coerce
		.number({ message: "Informe os dias" })
		.min(0, "O valor mínimo é 0"),
	isRural: z.enum(["yes", "no"]),
	isNighttimeWork: z.enum(["yes", "no"]),
});

type NightAllowanceFormProps = {
	onCalculate: (data: CalculateNightAllowanceResult) => void;
};

type NightAllowanceFormValues = z.infer<typeof nightAllowanceFormSchema>;

export function NightAllowanceCalculatorForm(props: NightAllowanceFormProps) {
	const { onCalculate } = props;

	const form = useForm<NightAllowanceFormValues>({
		resolver: zodResolver(
			nightAllowanceFormSchema,
		) as Resolver<NightAllowanceFormValues>,
		defaultValues: {
			grossSalary: "",
			contractualHours: 0,
			workedHours: 0,
			minutes: 0,
			percentageAllowance: 0,
			usefulDays: 0,
			holidaysAndSundays: 0,
			isRural: "no",
			isNighttimeWork: "no",
		},
	});

	function onSubmit(data: NightAllowanceFormValues) {
		const grossSalary = parseCurrencyToNumber(data.grossSalary);

		const result = calculateNightAllowance({
			grossSalary,
			contractualHours: data.contractualHours,
			workedHours: data.workedHours,
			minutes: data.minutes,
			percentageAllowance: data.percentageAllowance,
			usefulDays: data.usefulDays,
			holidaysAndSundays: data.holidaysAndSundays,
			isRural: data.isRural === "yes",
			isNighttimeWork: data.isNighttimeWork === "yes",
		});

		onCalculate(result);
	}

	function handleCurrencyInputChange(
		name: keyof NightAllowanceFormValues,
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
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Dados do Funcionário</h3>

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
											Valor total do salário antes de quaisquer descontos. É o
											valor do salário registrado em carteira.
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
						name="contractualHours"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Horas Contratuais*</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Total de horas mensais contratadas. O padrão é 220 horas
											por mês (8h por dia, 44h por semana).
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<Input type="tel" min={1} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="isNighttimeWork"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Tipo de Hora*</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Selecione se as horas informadas já são noturnas ou se são
											diurnas que precisam ser convertidas.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<NativeSelect
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
									>
										<option value="no">Diurnas</option>
										<option value="yes">Noturnas</option>
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="workedHours"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Horas Trabalhadas*</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Total de horas trabalhadas no período a ser convertido em
											horas noturnas, se aplicável.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<Input type="tel" min={0} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="minutes"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Minutos</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Minutos adicionais para complementar as horas trabalhadas.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<Input type="tel" min={0} max={59} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="usefulDays"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Dias Úteis no Mês*</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Total de dias úteis no mês, excluindo fins de semana e
											feriados.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<Input type="tel" min={1} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="holidaysAndSundays"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Domingos e Feriados no Mês</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Quantidade de domingos e feriados no mês para cálculo de
											RSR/DSR.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<Input type="tel" min={0} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="isRural"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Trabalhador Rural*</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Trabalhadores rurais têm direito a adicional noturno de
											25%. Urbanos recebem 20%. Selecione conforme o caso.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<NativeSelect
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
									>
										<option value="no">Não</option>
										<option value="yes">Sim</option>
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="percentageAllowance"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Percentual do Adicional Noturno*</FormLabel>
									<Popover>
										<PopoverTrigger className="text-gray-500">
											<Info size={16} />
										</PopoverTrigger>
										<PopoverContent className="w-60 text-sm">
											Percentual do adicional noturno. Urbano: 20%, Rural: 25%.
											Esse valor será aplicado sobre o valor da hora.
										</PopoverContent>
									</Popover>
								</div>
								<FormControl>
									<Input type="tel" min={0} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit">Calcular Adicional Noturno</Button>
			</form>
		</Form>
	);
}
