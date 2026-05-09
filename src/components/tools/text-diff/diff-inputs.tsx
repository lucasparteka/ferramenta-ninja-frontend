"use client";

import { ArrowLeftRight, Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DiffInputsProps = {
	leftText: string;
	rightText: string;
	onLeftChange: (value: string) => void;
	onRightChange: (value: string) => void;
	onSwap: () => void;
};

function FileUploadButton({ onLoad }: { onLoad: (content: string) => void }) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result;
			if (typeof content === "string") onLoad(content);
		};
		reader.readAsText(file);
		event.target.value = "";
	}

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept=".txt,.json"
				className="hidden"
				onChange={handleFileChange}
				aria-label="Carregar arquivo"
			/>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => inputRef.current?.click()}
				className="gap-1.5"
			>
				<Upload className="size-3.5" />
				Carregar
			</Button>
		</>
	);
}

export function DiffInputs({
	leftText,
	rightText,
	onLeftChange,
	onRightChange,
	onSwap,
}: DiffInputsProps) {
	return (
		<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_auto_1fr]">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="left-text">Texto original</Label>
					<FileUploadButton onLoad={onLeftChange} />
				</div>
				<Textarea
					id="left-text"
					value={leftText}
					onChange={(e) => onLeftChange(e.target.value)}
					placeholder="Cole o texto original aqui..."
					className="min-h-48 resize-y font-mono placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</div>

			<div className="flex items-center justify-center md:px-2">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onClick={onSwap}
					aria-label="Inverter textos"
				>
					<ArrowLeftRight className="h-3.5 w-3.5 rotate-90 md:rotate-0" />
				</Button>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="right-text">Texto modificado</Label>
					<FileUploadButton onLoad={onRightChange} />
				</div>
				<Textarea
					id="right-text"
					value={rightText}
					onChange={(e) => onRightChange(e.target.value)}
					placeholder="Cole o texto modificado aqui..."
					className="min-h-48 resize-y font-mono placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</div>
		</div>
	);
}
