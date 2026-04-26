"use client";

import { format, isValid, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateInputProps = {
	value: string;
	onChange: (value: string) => void;
	id?: string;
	placeholder?: string;
	min?: string;
	max?: string;
	disabled?: boolean;
	withCalendar?: boolean;
	className?: string;
};

function applyMask(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 8);
	if (digits.length <= 2) return digits;
	if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
	return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isoToDisplay(iso: string): string {
	if (!iso) return "";
	const d = parseISO(iso);
	return isValid(d) ? format(d, "dd/MM/yyyy") : "";
}

function displayToIso(display: string): string {
	if (display.length !== 10) return "";
	const d = parse(display, "dd/MM/yyyy", new Date());
	if (!isValid(d)) return "";
	return format(d, "yyyy-MM-dd");
}

function inRange(iso: string, min?: string, max?: string): boolean {
	if (!iso) return true;
	if (min && iso < min) return false;
	if (max && iso > max) return false;
	return true;
}

export function DateInput({
	value,
	onChange,
	id,
	placeholder = "DD/MM/AAAA",
	min,
	max,
	disabled,
	withCalendar = true,
	className,
}: DateInputProps) {
	const [display, setDisplay] = useState(() => isoToDisplay(value));
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const next = isoToDisplay(value);
		setDisplay((current) => {
			if (displayToIso(current) === value) return current;
			return next;
		});
	}, [value]);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const masked = applyMask(e.target.value);
		setDisplay(masked);
		const iso = displayToIso(masked);
		if (iso && inRange(iso, min, max)) {
			if (iso !== value) onChange(iso);
		} else if (value !== "") {
			onChange("");
		}
	}

	const selected = value ? parseISO(value) : undefined;
	const minDate = min ? parseISO(min) : undefined;
	const maxDate = max ? parseISO(max) : undefined;

	return (
		<div className={cn("relative", className)}>
			<Input
				id={id}
				type="text"
				inputMode="numeric"
				autoComplete="off"
				placeholder={placeholder}
				value={display}
				disabled={disabled}
				onChange={handleInputChange}
				className={withCalendar ? "pr-9" : undefined}
			/>
			{withCalendar && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						render={
							<button
								type="button"
								disabled={disabled}
								aria-label="Abrir calendário"
								className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
							>
								<CalendarIcon className="h-4 w-4" />
							</button>
						}
					/>
					<PopoverContent align="end" className="w-auto p-0">
						<Calendar
							mode="single"
							selected={selected && isValid(selected) ? selected : undefined}
							onSelect={(d) => {
								if (d && isValid(d)) {
									const iso = format(d, "yyyy-MM-dd");
									if (inRange(iso, min, max)) {
										onChange(iso);
										setDisplay(format(d, "dd/MM/yyyy"));
										setOpen(false);
									}
								}
							}}
							disabled={(d) => {
								if (minDate && d < minDate) return true;
								if (maxDate && d > maxDate) return true;
								return false;
							}}
							defaultMonth={selected && isValid(selected) ? selected : undefined}
							locale={ptBR as never}
						/>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
