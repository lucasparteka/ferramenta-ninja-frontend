"use client";

import type { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
	/** Texto a ser copiado para o clipboard */
	text: string;
	/** Label do botão quando não está no estado de feedback (default: "Copiar") */
	label?: string;
	/** Texto exibido após cópia bem-sucedida (default: "Copiado") */
	feedbackText?: string;
	/** Duração do feedback em ms (default: 3000) */
	duration?: number;
	/** Exibir apenas ícone, sem texto */
	iconOnly?: boolean;
} & Omit<
	ButtonPrimitive.Props & VariantProps<typeof buttonVariants>,
	"children" | "onClick"
>;

export function CopyButton({
	text,
	label = "Copiar",
	feedbackText = "Copiado",
	duration = 3000,
	iconOnly = false,
	variant = "default",
	size = "default",
	className,
	disabled,
	...props
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), duration);
		});
	}, [text, duration]);

	return (
		<Button
			variant={variant}
			size={size}
			disabled={disabled}
			onClick={handleCopy}
			className={cn(iconOnly ? "" : "gap-1.5", className)}
			{...props}
		>
			<span className="relative inline-grid">
				<Copy
					className={cn(
						"col-start-1 row-start-1 transition-opacity duration-200",
						size === "sm" || size === "xs" ? "size-3.5" : "size-4",
						copied && "opacity-0",
					)}
				/>
				<Check
					className={cn(
						"col-start-1 row-start-1 transition-opacity duration-200",
						size === "sm" || size === "xs" ? "size-3.5" : "size-4",
						!copied && "opacity-0",
					)}
				/>
			</span>
			{!iconOnly && (
				<span className="grid grid-cols-1">
					<span
						className={cn(
							"col-start-1 row-start-1 transition-opacity duration-200",
							copied && "opacity-0",
						)}
					>
						{label}
					</span>
					<span
						className={cn(
							"col-start-1 row-start-1 transition-opacity duration-200",
							!copied && "opacity-0",
						)}
					>
						{feedbackText}
					</span>
				</span>
			)}
		</Button>
	);
}
