"use client";

import { ArrowLeftRight, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";

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
				variant="ghost"
				size="icon-sm"
				onClick={() => inputRef.current?.click()}
				aria-label="Carregar arquivo"
			>
				<Upload className="h-3.5 w-3.5" />
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
		<div className="relative grid grid-cols-1 md:grid-cols-2">
			<div className="flex flex-col border-b md:border-b-0 md:border-r border-border">
				<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
					<span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
						Texto original
					</span>
					<FileUploadButton onLoad={onLeftChange} />
				</div>

				<textarea
					value={leftText}
					onChange={(e) => onLeftChange(e.target.value)}
					placeholder="Cole o texto original aqui..."
					className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
					spellCheck={false}
				/>

				<div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2">
					<CopyButton
						text={leftText}
						disabled={!leftText}
						variant="ghost"
						size="icon-sm"
						iconOnly
					/>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onLeftChange("")}
						disabled={!leftText}
						aria-label="Limpar"
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
					<span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
						Texto modificado
					</span>
					<FileUploadButton onLoad={onRightChange} />
				</div>

				<textarea
					value={rightText}
					onChange={(e) => onRightChange(e.target.value)}
					placeholder="Cole o texto modificado aqui..."
					className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
					spellCheck={false}
				/>

				<div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2">
					<CopyButton
						text={rightText}
						disabled={!rightText}
						variant="ghost"
						size="icon-sm"
						iconOnly
					/>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onRightChange("")}
						disabled={!rightText}
						aria-label="Limpar"
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			<div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
				<button
					type="button"
					onClick={onSwap}
					className="rounded-full border border-border bg-card p-1.5 text-muted-foreground transition-colors shadow-sm hover:text-foreground hover:bg-muted"
					aria-label="Inverter textos"
				>
					<ArrowLeftRight className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	);
}
