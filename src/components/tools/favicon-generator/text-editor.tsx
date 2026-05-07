"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, Type } from "lucide-react";

interface TextEditorProps {
	onGenerate: (canvas: HTMLCanvasElement) => void;
	onBack: () => void;
}

const SYSTEM_FONTS = [
	{ label: "Arial", value: "Arial, sans-serif" },
	{ label: "Georgia", value: "Georgia, serif" },
	{ label: "Times", value: "Times New Roman, serif" },
	{ label: "Courier", value: "Courier New, monospace" },
	{ label: "Verdana", value: "Verdana, sans-serif" },
	{ label: "Impact", value: "Impact, sans-serif" },
	{ label: "Comic Sans", value: "Comic Sans MS, cursive" },
	{ label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
];

const PRESET_BG_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#3b82f6",
	"#a855f7",
	"#ec4899",
	"#06b6d4",
	"#1f2937",
	"#ffffff",
];

export function TextEditor({ onGenerate, onBack }: TextEditorProps) {
	const [text, setText] = useState("A");
	const [textColor, setTextColor] = useState("#ffffff");
	const [bgColor, setBgColor] = useState("#3b82f6");
	const [fontFamily, setFontFamily] = useState(SYSTEM_FONTS[0].value);
	const [isLoading, setIsLoading] = useState(false);
	const previewRef = useRef<HTMLCanvasElement>(null);

	const canvasSize = 320;
	const sourceSize = 512;

	useEffect(() => {
		const canvas = previewRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// clear
		ctx.clearRect(0, 0, canvasSize, canvasSize);

		// background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvasSize, canvasSize);

		// text
		ctx.fillStyle = textColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		// scale font from source 280px to preview size
		const fontSize = Math.round((280 / sourceSize) * canvasSize);
		ctx.font = `bold ${fontSize}px ${fontFamily}`;
		ctx.fillText(text, canvasSize / 2, canvasSize / 2 + fontSize * 0.05);
	}, [text, textColor, bgColor, fontFamily]);

	function handleGenerate() {
		setIsLoading(true);
		setTimeout(() => {
			const canvas = document.createElement("canvas");
			canvas.width = sourceSize;
			canvas.height = sourceSize;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				setIsLoading(false);
				return;
			}

			// background
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, sourceSize, sourceSize);

			// text
			ctx.fillStyle = textColor;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = `bold 280px ${fontFamily}`;
			ctx.fillText(text, sourceSize / 2, sourceSize / 2 + 14); // slight optical center adjustment

			onGenerate(canvas);
			setIsLoading(false);
		}, 200);
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 40 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -40 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="mx-auto max-w-3xl"
		>
			<div className="mb-6 flex items-center gap-3">
				<Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
					<ArrowLeft className="h-4 w-4" />
					Voltar
				</Button>
				<h2 className="text-xl font-semibold flex items-center gap-2 text-green-600">
					<Type className="h-5 w-5" />
					Editor de Texto
				</h2>
			</div>

			{/* Preview */}
			<div className="mb-6 flex justify-center">
				<div className="relative overflow-hidden rounded-xl border shadow">
					<canvas
						ref={previewRef}
						width={canvasSize}
						height={canvasSize}
						className="block"
						aria-label="Prévia do favicon de texto"
					/>
				</div>
			</div>

			{/* Controls */}
			<div className="space-y-4">
				{/* Text input */}
				<div>
					<label
						htmlFor="favicon-text"
						className="mb-1 block text-sm font-medium"
					>
						Texto (1-2 caracteres)
					</label>
					<input
						id="favicon-text"
						type="text"
						value={text}
						onChange={(e) => {
							const v = e.target.value.slice(0, 2);
							setText(v);
						}}
						maxLength={2}
						className="w-full rounded-lg border bg-background px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
						placeholder="A"
					/>
				</div>

				{/* Font select */}
				<div>
					<label
						htmlFor="favicon-font"
						className="mb-1 block text-sm font-medium"
					>
						Fonte
					</label>
					<select
						id="favicon-font"
						value={fontFamily}
						onChange={(e) => setFontFamily(e.target.value)}
						className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
					>
						{SYSTEM_FONTS.map((f) => (
							<option key={f.value} value={f.value}>
								{f.label}
							</option>
						))}
					</select>
				</div>

				{/* Colors */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label
							htmlFor="favicon-text-color"
							className="mb-1 block text-sm font-medium"
						>
							Cor do Texto
						</label>
						<div className="flex items-center gap-2">
							<input
								id="favicon-text-color"
								type="color"
								value={textColor}
								onChange={(e) => setTextColor(e.target.value)}
								className="h-10 w-10 cursor-pointer rounded-md border-0 p-0"
								aria-label="Cor do texto"
							/>
							<code className="rounded bg-muted px-2 py-1 text-xs">
								{textColor}
							</code>
						</div>
					</div>
					<div>
						<label
							htmlFor="favicon-bg-color"
							className="mb-1 block text-sm font-medium"
						>
							Cor de Fundo
						</label>
						<div className="flex items-center gap-2">
							<input
								id="favicon-bg-color"
								type="color"
								value={bgColor}
								onChange={(e) => setBgColor(e.target.value)}
								className="h-10 w-10 cursor-pointer rounded-md border-0 p-0"
								aria-label="Cor de fundo"
							/>
							<code className="rounded bg-muted px-2 py-1 text-xs">
								{bgColor}
							</code>
						</div>
					</div>
				</div>

				{/* Background presets */}
				<div>
					<span className="mb-2 block text-sm font-medium">
						Presets de Fundo
					</span>
					<div className="flex flex-wrap gap-2">
						{PRESET_BG_COLORS.map((c) => (
							<button
								type="button"
								key={c}
								onClick={() => setBgColor(c)}
								title={c}
								className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 ${
									bgColor.toLowerCase() === c.toLowerCase()
										? "border-green-600 scale-110"
										: "border-transparent"
								}`}
								style={{ backgroundColor: c }}
								aria-label={`Selecionar cor de fundo ${c}`}
							>
								{bgColor.toLowerCase() === c.toLowerCase() && (
									<Check className="h-4 w-4 mx-auto text-white drop-shadow" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-2 pt-2">
					<Button
						variant="outline"
						onClick={onBack}
						disabled={isLoading}
						className="flex-1"
					>
						Voltar
					</Button>
					<Button
						onClick={handleGenerate}
						disabled={isLoading || !text.trim()}
						className="flex-1 bg-green-600 hover:bg-green-700 text-white"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Gerando...
							</>
						) : (
							"Gerar Favicon"
						)}
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
