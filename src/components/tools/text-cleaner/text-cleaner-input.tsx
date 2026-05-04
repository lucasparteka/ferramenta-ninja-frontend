"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export function TextCleanerInput({ value, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	function handleFile(file: File) {
		const reader = new FileReader();

		reader.onload = (e) => {
			const content = e.target?.result;
			if (typeof content === "string") {
				onChange(content);
			}
		};

		reader.readAsText(file);
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		handleFile(file);
		event.target.value = "";
	}

	function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setIsDragging(false);

		const file = event.dataTransfer.files?.[0];
		if (!file) return;

		handleFile(file);
	}

	function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<Label htmlFor="text-cleaner-input">Texto de entrada</Label>
				<input
					ref={inputRef}
					type="file"
					accept=".txt,.csv,.json"
					className="hidden"
					onChange={handleFileChange}
				/>

				<Button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="gap-1.5"
				>
					<Upload className="size-3.5" />
					Carregar arquivo
				</Button>
			</div>
			<section
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragEnter={() => setIsDragging(true)}
				onDragLeave={() => setIsDragging(false)}
				className={`rounded-md border transition-colors ${
					isDragging ? "border-primary bg-muted" : ""
				}`}
				aria-label="Drag and drop area for file upload"
			>
				<Textarea
					id="text-cleaner-input"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Cole seu texto aqui ou arraste um arquivo..."
					className="min-h-48 resize-y border-0 font-mono"
				/>
			</section>
		</div>
	);
}
