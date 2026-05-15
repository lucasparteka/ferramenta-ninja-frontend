"use client";

import { Smile } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { emojiCategories } from "@/lib/data/emojis";
import type { FaviconMode } from "@/lib/image/favicon";
import { cn } from "@/lib/utils";
import { FaviconShell } from "./favicon-shell";
import {
	ColorField,
	drawBackground,
	type Format,
	FormatField,
	LivePreview,
	ModeTabs,
	Section,
	SizeSlider,
} from "./shared-controls";

interface EmojiEditorProps {
	mode: FaviconMode;
	onChangeMode: (m: FaviconMode) => void;
	onGenerate: (
		canvas: HTMLCanvasElement,
		renderAtSize?: (
			size: number,
		) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
	) => void;
	footer?: React.ReactNode;
}

const SOURCE_SIZE = 512;
const FONT_STACK =
	'"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

function drawEmoji(
	ctx: CanvasRenderingContext2D,
	size: number,
	emoji: string,
	bgColor: string,
	format: Format,
	emojiSize: number,
	textColor: string,
) {
	ctx.clearRect(0, 0, size, size);
	drawBackground(ctx, size, bgColor, format);
	const fontSize = Math.round((size * emojiSize) / 100);
	ctx.font = `${fontSize}px ${FONT_STACK}`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if (textColor) ctx.fillStyle = textColor;
	ctx.fillText(emoji, size / 2, size / 2 + fontSize * 0.05);
}

export function EmojiEditor({
	mode,
	onChangeMode,
	onGenerate,
	footer,
}: EmojiEditorProps) {
	const [selectedEmoji, setSelectedEmoji] = useState("😀");
	const [customInput, setCustomInput] = useState("");
	const [bgColor, setBgColor] = useState("#F59E0B");
	const [textColor, setTextColor] = useState("");
	const [emojiSize, setEmojiSize] = useState(70);
	const [format, setFormat] = useState<Format>("square");
	const [activeCategory, setActiveCategory] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);

	const allEmojis = useMemo(() => emojiCategories.flatMap((c) => c.items), []);

	const renderAtSize = useCallback(
		(size: number): HTMLCanvasElement => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				drawEmoji(
					ctx,
					size,
					selectedEmoji,
					bgColor,
					format,
					emojiSize,
					textColor,
				);
			}
			return canvas;
		},
		[selectedEmoji, bgColor, format, emojiSize, textColor],
	);

	const handleGenerate = useCallback(() => {
		setIsGenerating(true);
		setTimeout(() => {
			const canvas = renderAtSize(SOURCE_SIZE);
			setIsGenerating(false);
			onGenerate(canvas, renderAtSize);
		}, 200);
	}, [renderAtSize, onGenerate]);

	const emojis =
		activeCategory === -1
			? allEmojis
			: (emojiCategories[activeCategory]?.items ?? []);

	const left = (
		<>
			<div className="p-4 border-b border-border">
				<ModeTabs value={mode} onChange={onChangeMode} />
			</div>

			<Section title="Emoji personalizado">
				<Input
					value={customInput}
					onChange={(e) => {
						const v = e.target.value;
						setCustomInput(v);
						if (v) {
							setSelectedEmoji(v);
							const isEmoji = /\p{Emoji}/u.test(v);
							setTextColor(isEmoji ? "" : "#1F2937");
						}
					}}
					placeholder="Cole ou digite"
					className="text-center text-xl placeholder:text-sm"
				/>
			</Section>

			<Section title="Catálogo">
				<div className="flex flex-wrap gap-1">
					<button
						type="button"
						onClick={() => setActiveCategory(-1)}
						className={cn(
							"inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
							activeCategory === -1
								? "bg-accent text-accent-foreground"
								: "bg-muted text-muted-foreground hover:bg-muted/80",
						)}
					>
						<Smile className="h-3 w-3" />
						Todos
					</button>
					{emojiCategories.map((cat, idx) => (
						<button
							key={cat.name}
							type="button"
							onClick={() => setActiveCategory(idx)}
							className={cn(
								"inline-flex shrink-0 items-center rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
								activeCategory === idx
									? "bg-accent text-accent-foreground"
									: "bg-muted text-muted-foreground hover:bg-muted/80",
							)}
						>
							{cat.name.split(" ")[0]}
						</button>
					))}
				</div>

				<div className="mt-3 grid max-h-70 grid-cols-6 gap-0.5 overflow-y-auto rounded-lg border bg-background p-2">
					{emojis.map((emoji) => (
						<button
							key={emoji}
							type="button"
							onClick={() => {
								setSelectedEmoji(emoji);
								setCustomInput(emoji);
								setTextColor("");
							}}
							className={cn(
								"flex h-9 w-9 items-center justify-center rounded-md text-lg transition-all",
								selectedEmoji === emoji
									? "bg-accent ring-1 ring-ring/50"
									: "hover:bg-muted",
							)}
							title={emoji}
						>
							{emoji}
						</button>
					))}
				</div>
			</Section>
		</>
	);

	const center = (
		<LivePreview
			render={renderAtSize}
			deps={[selectedEmoji, bgColor, format, emojiSize, textColor]}
			bgTransparent={bgColor === "transparent"}
		/>
	);

	const right = (
		<>
			<Section title="Cor de fundo">
				<ColorField value={bgColor} onChange={setBgColor} />
			</Section>
			<Section title="Forma">
				<FormatField value={format} onChange={setFormat} />
			</Section>
			<Section title="Escala">
				<SizeSlider
					value={emojiSize}
					onChange={setEmojiSize}
					min={40}
					max={90}
				/>
			</Section>
		</>
	);

	return (
		<FaviconShell
			left={left}
			center={center}
			right={right}
			footer={footer}
			onGenerate={handleGenerate}
			canGenerate={!!selectedEmoji}
			isGenerating={isGenerating}
		/>
	);
}
