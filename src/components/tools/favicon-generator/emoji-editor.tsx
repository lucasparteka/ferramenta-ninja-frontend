"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowLeft,
	Smile,
	User,
	Cat,
	Apple,
	Plane,
	Lightbulb,
	Heart,
	Wand2,
	Loader2,
} from "lucide-react";
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

const PREVIEW_SIZE = 320;
const SOURCE_SIZE = 512;

interface EmojiEditorProps {
	onGenerate: (canvas: HTMLCanvasElement) => void;
	onBack: () => void;
}

export function EmojiEditor({ onGenerate, onBack }: EmojiEditorProps) {
	const [selectedEmoji, setSelectedEmoji] = useState<string>("😀");
	const [bgColor, setBgColor] = useState("#F59E0B");
	const [emojiSize, setEmojiSize] = useState(70);
	const [activeCategory, setActiveCategory] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);

	/* ---------- render preview ---------- */
	const renderPreview = useCallback(() => {
		const canvas = previewCanvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = PREVIEW_SIZE;
		canvas.height = PREVIEW_SIZE;

		// background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

		// emoji
		const fontSize = Math.round((PREVIEW_SIZE * emojiSize) / 100);
		ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
			selectedEmoji,
			PREVIEW_SIZE / 2,
			PREVIEW_SIZE / 2 + fontSize * 0.05,
		);
	}, [selectedEmoji, bgColor, emojiSize]);

	useEffect(() => {
		renderPreview();
	}, [renderPreview]);

	/* ---------- generate ---------- */
	const handleGenerate = useCallback(() => {
		setIsLoading(true);

		// small delay to show loading state
		setTimeout(() => {
			const canvas = document.createElement("canvas");
			canvas.width = SOURCE_SIZE;
			canvas.height = SOURCE_SIZE;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				setIsLoading(false);
				return;
			}

			// background
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, SOURCE_SIZE, SOURCE_SIZE);

			// emoji
			const fontSize = Math.round((SOURCE_SIZE * emojiSize) / 100);
			ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(
				selectedEmoji,
				SOURCE_SIZE / 2,
				SOURCE_SIZE / 2 + fontSize * 0.05,
			);

			sourceCanvasRef.current = canvas;
			setIsLoading(false);
			onGenerate(canvas);
		}, 300);
	}, [selectedEmoji, bgColor, emojiSize, onGenerate]);

	/* ---------- color presets ---------- */
	const colorPresets = useMemo(
		() => [
			"#F59E0B",
			"#EF4444",
			"#3B82F6",
			"#10B981",
			"#8B5CF6",
			"#EC4899",
			"#06B6D4",
			"#F97316",
			"#6366F1",
			"#14B8A6",
		],
		[],
	);

	const allEmojis = useMemo(
		() => emojiCategories.map((cat) => cat.items).flat(),
		[],
	);

	return (
		<div className="space-y-6">
			{/* header */}
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
					<Smile className="h-5 w-5" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">Emoji</h2>
					<p className="text-sm text-muted-foreground">
						Escolha um emoji e personalize o fundo
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_280px]">
				{/* left: emoji grid */}
				<div className="space-y-4">
					{/* category chips */}
					<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

					{/* emoji grid */}
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
										onClick={() => setSelectedEmoji(emoji)}
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

				{/* right: preview + controls */}
				<div className="space-y-4">
					{/* preview canvas */}
					<div className="flex justify-center">
						<div className="relative">
							<canvas
								ref={previewCanvasRef}
								width={PREVIEW_SIZE}
								height={PREVIEW_SIZE}
								className="rounded-xl border shadow-sm"
								style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
							/>
							{/* selected badge */}
							<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
								{selectedEmoji}
							</div>
						</div>
					</div>

					{/* controls */}
					<div className="space-y-4 rounded-xl border bg-card p-4">
						{/* background color */}
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
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</button>
								))}
							</div>
						</div>

						{/* size slider */}
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

					{/* actions */}
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
