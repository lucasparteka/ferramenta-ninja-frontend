"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Apple,
	ArrowLeft,
	Cat,
	Heart,
	Lightbulb,
	Loader2,
	Plane,
	Smile,
	User,
	Wand2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import { emojiCategories } from "@/lib/data/emojis";

/* ------------------------------------------------------------------ */
/*  Mapeamento de ícones por categoria                                 */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
	"Rostos e emoções": <Smile className="h-4 w-4" />,
	"Gestos e pessoas": <User className="h-4 w-4" />,
	"Animais e natureza": <Cat className="h-4 w-4" />,
	"Comida e bebida": <Apple className="h-4 w-4" />,
	"Viagens e lugares": <Plane className="h-4 w-4" />,
	"Atividades e objetos": <Lightbulb className="h-4 w-4" />,
	"Corações e símbolos": <Heart className="h-4 w-4" />,
};

const FONT_STACK =
	'"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const PREVIEW_SIZE = 320;
const SOURCE_SIZE = 512;

const FORMATS = [
	{ label: "Quadrado", value: "square" },
	{ label: "Arredondado", value: "rounded" },
	{ label: "Redondo", value: "circle" },
] as const;

function drawBackground(
	ctx: CanvasRenderingContext2D,
	size: number,
	color: string,
	format: (typeof FORMATS)[number]["value"],
) {
	ctx.fillStyle = color;
	switch (format) {
		case "circle":
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			ctx.fill();
			break;
		case "rounded": {
			const r = Math.round(size * 0.2);
			ctx.beginPath();
			(
				ctx as CanvasRenderingContext2D & { roundRect?: typeof ctx.roundRect }
			).roundRect?.(0, 0, size, size, r);
			ctx.fill();
			break;
		}
		default:
			ctx.fillRect(0, 0, size, size);
	}
}

interface EmojiEditorProps {
	onGenerate: (
		canvas: HTMLCanvasElement,
		renderAtSize?: (
			size: number,
		) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
	) => void;
	onBack: () => void;
}

export function EmojiEditor({ onGenerate, onBack }: EmojiEditorProps) {
	const [selectedEmoji, setSelectedEmoji] = useState<string>("😀");
	const [customInput, setCustomInput] = useState<string>("");
	const [bgColor, setBgColor] = useState("#F59E0B");
	const [textColor, setTextColor] = useState("");
	const [emojiSize, setEmojiSize] = useState(70);
	const [format, setFormat] = useState<"square" | "rounded" | "circle">(
		"square",
	);
	const [activeCategory, setActiveCategory] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const mini16Ref = useRef<HTMLCanvasElement>(null);
	const mini32Ref = useRef<HTMLCanvasElement>(null);
	const mini48Ref = useRef<HTMLCanvasElement>(null);

	const renderPreview = useCallback(() => {
		const canvas = previewCanvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = PREVIEW_SIZE;
		canvas.height = PREVIEW_SIZE;

		drawBackground(ctx, PREVIEW_SIZE, bgColor, format);

		const fontSize = Math.round((PREVIEW_SIZE * emojiSize) / 100);
		ctx.font = `${fontSize}px ${FONT_STACK}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		if (textColor) ctx.fillStyle = textColor;
		ctx.fillText(
			selectedEmoji,
			PREVIEW_SIZE / 2,
			PREVIEW_SIZE / 2 + fontSize * 0.05,
		);
	}, [selectedEmoji, bgColor, emojiSize, format, textColor]);

	useEffect(() => {
		renderPreview();
	}, [renderPreview]);

	const renderAtSize = useCallback(
		(size: number): HTMLCanvasElement => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				drawBackground(ctx, size, bgColor, format);
				const fontSize = Math.round((size * emojiSize) / 100);
				ctx.font = `${fontSize}px ${FONT_STACK}`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				if (textColor) ctx.fillStyle = textColor;
				ctx.fillText(selectedEmoji, size / 2, size / 2 + fontSize * 0.05);
			}
			return canvas;
		},
		[selectedEmoji, bgColor, emojiSize, format, textColor],
	);

	useEffect(() => {
		const sizes = [16, 32, 48];
		const refs = [mini16Ref, mini32Ref, mini48Ref];

		sizes.forEach((size, idx) => {
			const canvas = refs[idx].current;
			if (!canvas) return;
			const rendered = renderAtSize(size);
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			canvas.width = size;
			canvas.height = size;
			ctx.drawImage(rendered, 0, 0);
		});
	}, [renderAtSize]);

	const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCustomInput(value);
		if (value) {
			setSelectedEmoji(value);
			const isEmoji = /\p{Emoji}/u.test(value);
			setTextColor(isEmoji ? "" : "#1F2937");
		}
	};

	const handleGenerate = useCallback(() => {
		setIsLoading(true);

		setTimeout(() => {
			const canvas = document.createElement("canvas");
			canvas.width = SOURCE_SIZE;
			canvas.height = SOURCE_SIZE;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				setIsLoading(false);
				return;
			}

			drawBackground(ctx, SOURCE_SIZE, bgColor, format);

			const fontSize = Math.round((SOURCE_SIZE * emojiSize) / 100);
			ctx.font = `${fontSize}px ${FONT_STACK}`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			if (textColor) ctx.fillStyle = textColor;
			ctx.fillText(
				selectedEmoji,
				SOURCE_SIZE / 2,
				SOURCE_SIZE / 2 + fontSize * 0.05,
			);

			sourceCanvasRef.current = canvas;
			setIsLoading(false);
			onGenerate(canvas, renderAtSize);
		}, 300);
	}, [
		selectedEmoji,
		bgColor,
		emojiSize,
		format,
		textColor,
		onGenerate,
		renderAtSize,
	]);

	const colorPresets = useMemo(
		() => [
			"#F59E0B",
			"#F97316",
			"#FB923C",
			"#FBBF24",
			"#EF4444",
			"#EC4899",
			"#F472B6",
			"#DB2777",
			"#3B82F6",
			"#6366F1",
			"#8B5CF6",
			"#06B6D4",
			"#10B981",
			"#14B8A6",
			"#22C55E",
			"#84CC16",
			"#1F2937",
			"#4B5563",
			"#9CA3AF",
			"#FFFFFF",
		],
		[],
	);

	const allEmojis = useMemo(
		() => emojiCategories.flatMap((cat) => cat.items),
		[],
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-xl dark:bg-amber-900">
					😃
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">Emoji</h2>
					<p className="text-sm text-muted-foreground">
						Escolha um emoji e personalize o fundo
					</p>
				</div>
			</div>
			<div className="grid gap-6 lg:grid-cols-[1fr_325px]">
				<div className="space-y-4">
					<div className="rounded-xl border bg-card p-4">
						<label
							htmlFor="emoji-custom"
							className="text-sm font-medium text-foreground"
						>
							Emoji personalizado
						</label>
						<input
							autoComplete="off"
							id="emoji-custom"
							type="text"
							value={customInput}
							onChange={handleCustomInputChange}
							className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-center text-2xl"
						/>
					</div>
					<div className="flex flex-wrap gap-2 pb-2">
						{emojiCategories.map((cat, idx) => (
							<button
								key={cat.name}
								type="button"
								onClick={() => setActiveCategory(idx)}
								className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
									activeCategory === idx
										? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
										: "bg-muted text-muted-foreground hover:bg-muted/80"
								}`}
							>
								{CATEGORY_ICONS[cat.name] ?? <Smile className="h-4 w-4" />}
								{cat.name}
							</button>
						))}
						<button
							type="button"
							onClick={() => setActiveCategory(-1)}
							className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
								activeCategory === -1
									? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
						>
							<Smile className="h-4 w-4" />
							Todos
						</button>
					</div>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeCategory}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2 }}
							className="rounded-xl border bg-card p-4"
						>
							<div className="grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-10">
								{(activeCategory === -1
									? allEmojis
									: (emojiCategories[activeCategory]?.items ?? [])
								).map((emoji) => (
									<button
										key={emoji}
										type="button"
										onClick={() => {
											setSelectedEmoji(emoji);
											setCustomInput(emoji);
										}}
										className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all sm:h-11 sm:w-11 sm:text-2xl ${
											selectedEmoji === emoji
												? "bg-amber-100 text-amber-700 ring-2 ring-amber-400 dark:bg-amber-950 dark:text-amber-300"
												: "hover:bg-muted"
										}`}
										aria-label={`Selecionar emoji ${emoji}`}
										title={emoji}
									>
										{emoji}
									</button>
								))}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="space-y-4">
					<div className="w-full">
						<div className="relative">
							<canvas
								ref={previewCanvasRef}
								width={PREVIEW_SIZE}
								height={PREVIEW_SIZE}
								className="w-full aspect-square"
							/>
							<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
								{selectedEmoji}
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center gap-4">
						{[
							{ label: "16×16", ref: mini16Ref, size: 16 },
							{ label: "32×32", ref: mini32Ref, size: 32 },
							{ label: "48×48", ref: mini48Ref, size: 48 },
						].map(({ label, ref: canvasRef, size }) => (
							<div key={label} className="flex flex-col items-center gap-1">
								<canvas
									ref={canvasRef}
									style={{
										width: size,
										height: size,
										imageRendering: "pixelated",
									}}
								/>
								<span className="text-[10px] text-muted-foreground">
									{label}
								</span>
							</div>
						))}
					</div>
					<div className="space-y-4 rounded-xl border bg-card p-4">
						<div className="space-y-2">
							<label
								htmlFor="emoji-bg-color"
								className="text-sm font-medium text-foreground"
							>
								Cor de fundo
							</label>
							<div className="flex items-center gap-2">
								<input
									id="emoji-bg-color"
									type="color"
									value={bgColor}
									onChange={(e) => setBgColor(e.target.value)}
									className="h-9 w-9 cursor-pointer rounded-lg border bg-transparent p-0.5"
									aria-label="Cor de fundo"
								/>
								<code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
									{bgColor}
								</code>
							</div>
							<div className="flex flex-wrap gap-2">
								{colorPresets.map((c) => (
									<button
										key={c}
										type="button"
										onClick={() => setBgColor(c)}
										className={`h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
											bgColor === c ? "ring-2 ring-amber-400 ring-offset-2" : ""
										}`}
										style={{ backgroundColor: c }}
										aria-label={`Cor ${c}`}
									>
										{bgColor === c && (
											<svg
												className="mx-auto h-4 w-4 text-white drop-shadow"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={3}
												aria-hidden="true"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</button>
								))}
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-sm font-medium text-foreground">Formato</div>
							<OptionSwitch
								options={FORMATS.map((f) => ({
									value: f.value,
									label: f.label,
								}))}
								value={format}
								onChange={(v) =>
									setFormat(v as "square" | "rounded" | "circle")
								}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="emoji-size"
									className="text-sm font-medium text-foreground"
								>
									Tamanho do emoji
								</label>
								<span className="text-xs text-muted-foreground">
									{emojiSize}%
								</span>
							</div>
							<input
								id="emoji-size"
								type="range"
								min={40}
								max={90}
								value={emojiSize}
								onChange={(e) => setEmojiSize(Number(e.target.value))}
								className="w-full accent-amber-500"
								aria-label="Tamanho do emoji"
							/>
							<div className="flex justify-between text-[10px] text-muted-foreground">
								<span>40%</span>
								<span>90%</span>
							</div>
						</div>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={onBack} className="flex-1">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar
						</Button>
						<Button
							onClick={handleGenerate}
							disabled={isLoading}
							className="flex-1 bg-amber-600 text-white hover:bg-amber-700"
						>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Wand2 className="mr-2 h-4 w-4" />
							)}
							{isLoading ? "Gerando..." : "Gerar Favicon"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
