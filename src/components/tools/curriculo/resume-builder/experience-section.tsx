"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import {
	ChevronDown,
	ChevronUp,
	GripVertical,
	Plus,
	Trash2,
} from "lucide-react";
import { type ComponentProps, memo, useCallback, useState } from "react";
import {
	type Control,
	useFieldArray,
	useFormContext,
	useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ResumeFormValues } from "./types";

const MONTHS = [
	{ value: "01", label: "Janeiro" },
	{ value: "02", label: "Fevereiro" },
	{ value: "03", label: "Março" },
	{ value: "04", label: "Abril" },
	{ value: "05", label: "Maio" },
	{ value: "06", label: "Junho" },
	{ value: "07", label: "Julho" },
	{ value: "08", label: "Agosto" },
	{ value: "09", label: "Setembro" },
	{ value: "10", label: "Outubro" },
	{ value: "11", label: "Novembro" },
	{ value: "12", label: "Dezembro" },
];

const MONTH_SHORT = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez",
];

function formatMonthYear(yyyyMM: string): string {
	if (!yyyyMM || yyyyMM.length < 7) return "";
	const [year, month] = yyyyMM.split("-");
	return `${MONTH_SHORT[parseInt(month, 10) - 1]} ${year}`;
}

function newExperience() {
	return {
		id: crypto.randomUUID(),
		role: "",
		company: "",
		location: "",
		startDate: "",
		endDate: "",
		isCurrent: false,
		description: "",
	};
}

function MonthYearPicker({
	value,
	onChange,
	label,
}: {
	value: string;
	onChange: (val: string) => void;
	label: string;
}) {
	const [year = "", month = ""] = (value ?? "").split("-");

	function handleMonthChange(m: string) {
		onChange(`${year}-${m}`);
	}

	function handleYearChange(y: string) {
		onChange(`${y}-${month}`);
	}

	return (
		<div>
			<p className="text-sm font-medium mb-2">{label}</p>
			<div className="flex gap-2">
				<NativeSelect
					value={month}
					onChange={(e) => handleMonthChange(e.target.value)}
					className="flex-1"
				>
					<option value="" disabled>
						Mês
					</option>
					{MONTHS.map((mo) => (
						<option key={mo.value} value={mo.value}>
							{mo.label}
						</option>
					))}
				</NativeSelect>

				<Input
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					maxLength={4}
					placeholder="Ano"
					value={year}
					onChange={(e) => handleYearChange(e.target.value.replace(/\D/g, ""))}
					className="flex-1"
				/>
			</div>
		</div>
	);
}

const ExperienceCardHeader = memo(function ExperienceCardHeader({
	index,
	control,
	isOpen,
}: {
	index: number;
	control: Control<ResumeFormValues>;
	isOpen: boolean;
}) {
	const [role, company, startDate, endDate, isCurrent] = useWatch({
		control,
		name: [
			`experiences.${index}.role`,
			`experiences.${index}.company`,
			`experiences.${index}.startDate`,
			`experiences.${index}.endDate`,
			`experiences.${index}.isCurrent`,
		],
	});

	const dateLabel = isCurrent
		? `${formatMonthYear(startDate)} → Atual`
		: startDate
			? `${formatMonthYear(startDate)}${endDate ? ` → ${formatMonthYear(endDate)}` : ""}`
			: "";

	return (
		<div className="flex items-center gap-2 w-full">
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">
					{role || "Nova experiência"}
					{company ? ` — ${company}` : ""}
				</p>
				{dateLabel && (
					<p className="text-xs text-muted-foreground">{dateLabel}</p>
				)}
			</div>
			{isOpen ? (
				<ChevronUp size={14} className="text-muted-foreground shrink-0" />
			) : (
				<ChevronDown size={14} className="text-muted-foreground shrink-0" />
			)}
		</div>
	);
});

const ExperienceCardForm = memo(function ExperienceCardForm({
	index,
	control,
}: {
	index: number;
	control: Control<ResumeFormValues>;
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext<ResumeFormValues>();
	const isCurrent = useWatch({
		control,
		name: `experiences.${index}.isCurrent`,
	});

	return (
		<div className="border-t md:px-4 px-2 pb-4 pt-4 space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">Cargo *</label>
					<Input {...register(`experiences.${index}.role`)} />
					{errors.experiences?.[index]?.role && (
						<p className="text-sm text-destructive">
							{errors.experiences[index].role.message}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium">Empresa *</label>
					<Input
						placeholder="Ex: Empresa XPTO"
						{...register(`experiences.${index}.company`)}
					/>
					{errors.experiences?.[index]?.company && (
						<p className="text-sm text-destructive">
							{errors.experiences[index].company.message}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Localização</label>
				<Input
					placeholder="Ex: Florianópolis, SC · Remoto"
					{...register(`experiences.${index}.location`)}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={control}
					name={`experiences.${index}.startDate`}
					render={({ field }) => (
						<FormItem>
							<MonthYearPicker
								label="Data de início *"
								value={field.value}
								onChange={field.onChange}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				{!isCurrent && (
					<FormField
						control={control}
						name={`experiences.${index}.endDate`}
						render={({ field }) => (
							<FormItem>
								<MonthYearPicker
									label="Data de término"
									value={field.value}
									onChange={field.onChange}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
			</div>

			<FormField
				control={control}
				name={`experiences.${index}.isCurrent`}
				render={({ field }) => (
					<FormItem>
						<label className="flex items-center gap-2 cursor-pointer w-fit">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<span className="text-sm">Trabalho aqui atualmente</span>
						</label>
					</FormItem>
				)}
			/>

			<div className="space-y-2">
				<label className="text-sm font-medium">Descrição</label>
				<Textarea
					placeholder="Descreva suas responsabilidades, projetos e conquistas..."
					rows={3}
					{...register(`experiences.${index}.description`)}
				/>
			</div>
		</div>
	);
});

function ExperienceCard({
	fieldId,
	index,
	control,
	isOpen,
	onToggle,
	onRemove,
}: {
	fieldId: string;
	index: number;
	control: Control<ResumeFormValues>;
	isOpen: boolean;
	onToggle: (id: string) => void;
	onRemove: (index: number) => void;
}) {
	const { ref, handleRef, isDragSource, isDropTarget } = useSortable({
		id: fieldId,
		index,
	});

	const handleToggle = useCallback(
		() => onToggle(fieldId),
		[onToggle, fieldId],
	);
	const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

	return (
		<div ref={ref} className="flex items-center md:gap-2">
			<span
				ref={handleRef}
				className="cursor-grab active:cursor-grabbing shrink-0 touch-none text-muted-foreground/50 hover:text-muted-foreground transition-colors"
			>
				<GripVertical size={16} />
			</span>

			<div
				className={cn(
					"flex-1 border rounded-md bg-white transition-colors overflow-hidden",
					isDragSource && "opacity-50",
					isDropTarget && "border-primary border-l-4 bg-primary/5",
				)}
			>
				<div
					role="button"
					tabIndex={0}
					className="flex items-center px-3 py-3 cursor-pointer select-none"
					onClick={handleToggle}
					onKeyDown={(e) =>
						(e.key === "Enter" || e.key === " ") && handleToggle()
					}
				>
					<ExperienceCardHeader
						index={index}
						control={control}
						isOpen={isOpen}
					/>
				</div>

				{isOpen && <ExperienceCardForm index={index} control={control} />}
			</div>

			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="h-7 w-7 shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors"
				onClick={handleRemove}
			>
				<Trash2 size={15} />
			</Button>
		</div>
	);
}

export function ExperienceSection() {
	const { control } = useFormContext<ResumeFormValues>();
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "experiences",
	});

	const [openIds, setOpenIds] = useState<Set<string>>(new Set());
	const [prevFieldsLength, setPrevFieldsLength] = useState(fields.length);

	if (fields.length !== prevFieldsLength) {
		if (fields.length > prevFieldsLength) {
			setOpenIds((prev) => {
				const next = new Set(prev);
				next.add(fields[fields.length - 1].id);
				return next;
			});
		}
		setPrevFieldsLength(fields.length);
	}

	const handleToggle = useCallback((id: string) => {
		setOpenIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const handleRemove = useCallback((index: number) => remove(index), [remove]);

	const handleDragEnd = useCallback<
		NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>
	>(
		({ operation, canceled }) => {
			if (canceled || !isSortableOperation(operation)) return;
			if (operation.source == null) return;
			move(operation.source.initialIndex, operation.source.index);
		},
		[move],
	);

	return (
		<div className="space-y-3">
			<DragDropProvider onDragEnd={handleDragEnd}>
				{fields.map((field, index) => (
					<ExperienceCard
						key={field.id}
						fieldId={field.id}
						index={index}
						control={control}
						isOpen={openIds.has(field.id)}
						onToggle={handleToggle}
						onRemove={handleRemove}
					/>
				))}
			</DragDropProvider>

			<Button
				type="button"
				variant="link"
				onClick={() => append(newExperience())}
			>
				<Plus size={16} />
				Adicionar Experiência
			</Button>
		</div>
	);
}
