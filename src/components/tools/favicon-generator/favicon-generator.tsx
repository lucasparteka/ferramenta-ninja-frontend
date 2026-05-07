"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import type { FaviconMode, GeneratedFaviconFile } from "@/lib/image/favicon";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "./mode-selector";
import { ImageEditor } from "./image-editor";
import { SvgEditor } from "./svg-editor";
import { TextEditor } from "./text-editor";
import { EmojiEditor } from "./emoji-editor";
import { PreviewGrid } from "./preview-grid";
import { ExportPanel } from "./export-panel";

export type Step = "select-mode" | "edit" | "preview";

const stepVariants = {
	initial: (direction: number) => ({
		x: direction > 0 ? 40 : -40,
		opacity: 0,
	}),
	animate: {
		x: 0,
		opacity: 1,
		transition: {
			type: "spring" as const,
			damping: 25,
			stiffness: 300,
		},
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -40 : 40,
		opacity: 0,
		transition: { duration: 0.2 },
	}),
};

export function FaviconGenerator() {
	const [step, setStep] = useState<Step>("select-mode");
	const [mode, setMode] = useState<FaviconMode | null>(null);
	const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(
		null,
	);
	const [renderAtSize, setRenderAtSize] = useState<
		((size: number) => HTMLCanvasElement | Promise<HTMLCanvasElement>) | null
	>(null);
	const [generatedPackage, setGeneratedPackage] = useState<{
		files: GeneratedFaviconFile[];
		icoBlob: Blob;
	} | null>(null);
	// direction > 0 = avançando, < 0 = voltando
	const [direction, setDirection] = useState(1);

	const handleSelectMode = useCallback((selectedMode: FaviconMode) => {
		setDirection(1);
		setMode(selectedMode);
		setStep("edit");
	}, []);

	const handleBack = useCallback(() => {
		setDirection(-1);
		if (step === "preview") {
			setStep("edit");
		} else if (step === "edit") {
			setMode(null);
			setSourceCanvas(null);
			setRenderAtSize(null);
			setGeneratedPackage(null);
			setStep("select-mode");
		}
	}, [step]);

	const handleGenerate = useCallback(
		(
			canvas: HTMLCanvasElement,
			renderFn?: (
				size: number,
			) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
		) => {
			setDirection(1);
			setSourceCanvas(canvas);
			setRenderAtSize(() => renderFn ?? null);
			setStep("preview");
		},
		[],
	);

	const handleGenerated = useCallback(
		(files: GeneratedFaviconFile[], icoBlob: Blob) => {
			setGeneratedPackage({ files, icoBlob });
		},
		[],
	);

	const handleReset = useCallback(() => {
		setDirection(-1);
		setMode(null);
		setSourceCanvas(null);
		setRenderAtSize(null);
		setGeneratedPackage(null);
		setStep("select-mode");
	}, []);

	return (
		<div className="space-y-6">
			{/* Breadcrumb/navegação interna */}
			<AnimatePresence mode="wait">
				{(step === "edit" || step === "preview") && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2 }}
					>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleBack}
							className="mb-2 -ml-2"
						>
							← Voltar
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Step 1: mode selection */}
			<AnimatePresence mode="wait" custom={direction}>
				{step === "select-mode" && (
					<motion.div
						key="select-mode"
						custom={direction}
						variants={stepVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<ModeSelector onSelect={handleSelectMode} />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Step 2: editor — always mounted while mode exists (preserves state) */}
			{mode && (
				<motion.div
					initial={
						direction > 0 ? { x: 40, opacity: 0 } : { x: -40, opacity: 0 }
					}
					animate={{
						x: step === "edit" ? 0 : -40,
						opacity: step === "edit" ? 1 : 0,
					}}
					transition={{
						type: "spring" as const,
						damping: 25,
						stiffness: 300,
					}}
					style={{
						display: step === "edit" ? "block" : "none",
					}}
				>
					<FaviconEditor
						mode={mode}
						onGenerate={handleGenerate}
						onBack={handleBack}
					/>
				</motion.div>
			)}

			{/* Step 3: preview — AnimatePresence para entrada/saída */}
			<AnimatePresence mode="wait" custom={direction}>
				{step === "preview" && sourceCanvas && (
					<motion.div
						key="preview"
						custom={direction}
						variants={stepVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<FaviconPreview
							sourceCanvas={sourceCanvas}
							renderAtSize={renderAtSize ?? undefined}
							generatedPackage={generatedPackage}
							onBackToEditor={() => {
								setDirection(-1);
								setStep("edit");
							}}
							onReset={handleReset}
							onGenerated={handleGenerated}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Editor dispatcher                                                  */
/* ------------------------------------------------------------------ */

function FaviconEditor({
	mode,
	onGenerate,
	onBack,
}: {
	mode: FaviconMode;
	onGenerate: (
		canvas: HTMLCanvasElement,
		renderAtSize?: (
			size: number,
		) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
	) => void;
	onBack: () => void;
}) {
	if (mode === "image") {
		return <ImageEditor onGenerate={onGenerate} onBack={onBack} />;
	}

	if (mode === "svg") {
		return <SvgEditor onGenerate={onGenerate} onBack={onBack} />;
	}

	if (mode === "text") {
		return <TextEditor onGenerate={onGenerate} onBack={onBack} />;
	}

	if (mode === "emoji") {
		return <EmojiEditor onGenerate={onGenerate} onBack={onBack} />;
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Editor de favicon — modo: <strong>{mode}</strong>
			</p>
			<div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
				<p>Editor será implementado.</p>
			</div>
			<div className="flex gap-2">
				<Button variant="outline" onClick={onBack}>
					Voltar
				</Button>
				<Button disabled>Gerar Favicon</Button>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Preview wrapper (grid + export)                                    */
/* ------------------------------------------------------------------ */

function FaviconPreview({
	sourceCanvas,
	renderAtSize,
	generatedPackage,
	onBackToEditor,
	onReset,
	onGenerated,
}: {
	sourceCanvas: HTMLCanvasElement;
	renderAtSize?: (
		size: number,
	) => HTMLCanvasElement | Promise<HTMLCanvasElement>;
	generatedPackage: {
		files: GeneratedFaviconFile[];
		icoBlob: Blob;
	} | null;
	onBackToEditor: () => void;
	onReset: () => void;
	onGenerated: (files: GeneratedFaviconFile[], icoBlob: Blob) => void;
}) {
	return (
		<div className="space-y-8">
			<PreviewGrid
				sourceCanvas={sourceCanvas}
				renderAtSize={renderAtSize}
				onBackToEditor={onBackToEditor}
				onReset={onReset}
				onGenerated={onGenerated}
			/>
			{generatedPackage && (
				<ExportPanel
					files={generatedPackage.files}
					icoBlob={generatedPackage.icoBlob}
				/>
			)}
		</div>
	);
}
