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
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ResumeFormValues } from "./types";

const DEGREES = [
	"Ensino Médio",
	"Curso Técnico",
	"Tecnólogo",
	"Bacharelado",
	"Licenciatura",
	"Especialização",
	"MBA",
	"Mestrado",
	"Doutorado",
	"Pós-Doutorado",
	"Curso Livre",
];

function newEducation() {
	return {
		id: crypto.randomUUID(),
		institution: "",
		degree: "",
		field: "",
		startYear: "",
		endYear: "",
		isCurrent: false,
		description: "",
	};
}

const EducationCardHeader = memo(function EducationCardHeader({
	index,
	control,
	isOpen,
}: {
	index: number;
	control: Control<ResumeFormValues>;
	isOpen: boolean;
}) {
	const [degree, field, institution, startYear, endYear, isCurrent] = useWatch({
		control,
		name: [
			`education.${index}.degree`,
			`education.${index}.field`,
			`education.${index}.institution`,
			`education.${index}.startYear`,
			`education.${index}.endYear`,
			`education.${index}.isCurrent`,
		],
	});

	const summary = [degree, field].filter(Boolean).join(" em ");
	const yearRange = isCurrent
		? `${startYear} → Cursando`
		: startYear
			? `${startYear}${endYear ? ` → ${endYear}` : ""}`
			: "";

	return (
		<div className="flex items-center gap-2 w-full">
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">
					{summary || "Nova formação"}
					{institution ? ` — ${institution}` : ""}
				</p>
				{yearRange && (
					<p className="text-xs text-muted-foreground">{yearRange}</p>
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

const EducationCardForm = memo(function EducationCardForm({
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
	const isCurrent = useWatch({ control, name: `education.${index}.isCurrent` });

	return (
		<div className="border-t md:px-4 px-2 pb-4 pt-4 space-y-4">
			<div className="space-y-2">
				<label htmlFor="institution-input" className="text-sm font-medium">
					Instituição *
				</label>
				<Input
					id="institution-input"
					placeholder="Ex: Universidade Federal de Santa Catarina"
					{...register(`education.${index}.institution`)}
				/>
				{errors.education?.[index]?.institution && (
					<p className="text-sm text-destructive">
						{errors.education[index].institution.message}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={control}
					name={`education.${index}.degree`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Grau / Nível *</FormLabel>
							<FormControl>
								<NativeSelect {...field}>
									<option value="" disabled>
										Selecione...
									</option>
									{DEGREES.map((d) => (
										<option key={d} value={d}>
											{d}
										</option>
									))}
								</NativeSelect>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="space-y-2">
					<label htmlFor="course-area-input" className="text-sm font-medium">
						Curso / Área
					</label>
					<Input
						id="course-area-input"
						placeholder="Ex: Ciência da Computação"
						{...register(`education.${index}.field`)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={control}
					name={`education.${index}.startYear`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ano de início *</FormLabel>
							<FormControl>
								<Input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									maxLength={4}
									placeholder="Ex: 2020"
									value={field.value}
									onChange={(e) =>
										field.onChange(e.target.value.replace(/\D/g, ""))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{!isCurrent && (
					<FormField
						control={control}
						name={`education.${index}.endYear`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ano de conclusão</FormLabel>
								<FormControl>
									<Input
										type="text"
										inputMode="numeric"
										pattern="[0-9]*"
										maxLength={4}
										placeholder="Ex: 2024"
										value={field.value}
										onChange={(e) =>
											field.onChange(e.target.value.replace(/\D/g, ""))
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
			</div>

			<FormField
				control={control}
				name={`education.${index}.isCurrent`}
				render={({ field }) => (
					<FormItem>
						<label
							htmlFor={`education-${index}-isCurrent`}
							className="flex items-center gap-2 cursor-pointer w-fit"
						>
							<FormControl>
								<Checkbox
									id={`education-${index}-isCurrent`}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<span className="text-sm">Cursando atualmente</span>
						</label>
					</FormItem>
				)}
			/>

			<div className="space-y-2">
				<label htmlFor="education-description" className="text-sm font-medium">
					Descrição
				</label>
				<Textarea
					id="education-description"
					placeholder="Atividades relevantes, TCC, projetos de destaque..."
					rows={3}
					{...register(`education.${index}.description`)}
				/>
			</div>
		</div>
	);
});

function EducationCard({
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
				<button
					type="button"
					tabIndex={0}
					className="flex items-center px-3 py-3 cursor-pointer select-none"
					onClick={handleToggle}
					onKeyDown={(e) =>
						(e.key === "Enter" || e.key === " ") && handleToggle()
					}
				>
					<EducationCardHeader
						index={index}
						control={control}
						isOpen={isOpen}
					/>
				</button>

				{isOpen && <EducationCardForm index={index} control={control} />}
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

export function EducationSection() {
	const { control } = useFormContext<ResumeFormValues>();
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "education",
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
					<EducationCard
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
				onClick={() => append(newEducation())}
			>
				<Plus size={16} />
				Adicionar Formação
			</Button>
		</div>
	);
}
