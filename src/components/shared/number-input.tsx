"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NumberInputProps = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	className?: string;
	id?: string;
	disabled?: boolean;
	"aria-label"?: string;
};

export function NumberInput({
	value,
	onChange,
	min = 0,
	max,
	step,
	placeholder,
	className,
	id,
	disabled,
	"aria-label": ariaLabel,
}: NumberInputProps) {
	const [raw, setRaw] = useState(String(value));

	useEffect(() => {
		setRaw(String(value));
	}, [value]);

	const allowDecimal = step != null && step % 1 !== 0;

	function handleChange(input: string) {
		const pattern = allowDecimal ? /^[\d.,]*$/ : /^\d*$/;
		if (pattern.test(input)) {
			setRaw(input);
		}
	}

	function handleBlur() {
		const normalized = allowDecimal ? raw.replace(",", ".") : raw;

		let n = Number(normalized);
		if (Number.isNaN(n) || normalized === "" || normalized === "-") {
			n = min;
		}
		if (max != null) {
			n = Math.min(max, n);
		}
		n = Math.max(min, n);

		setRaw(String(n));
		onChange(n);
	}

	return (
		<Input
			type="text"
			inputMode={allowDecimal ? "decimal" : "numeric"}
			value={raw}
			onChange={(e) => handleChange(e.target.value)}
			onBlur={handleBlur}
			placeholder={placeholder}
			className={cn("font-mono", className)}
			id={id}
			disabled={disabled}
			aria-label={ariaLabel}
		/>
	);
}
