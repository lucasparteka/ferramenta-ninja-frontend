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
			setGeneratedPackage(null);
			setStep("select-mode");
		}
	}, [step]);

	const handleGenerate = useCallback((canvas: HTMLCanvasElement) => {
		setDirection(1);
		setSourceCanvas(canvas);
		setStep("preview");
	}, []);

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

				{step === "edit" && mode && (
					<motion.div
						key="edit"
						custom={direction}
						variants={stepVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<FaviconEditor
							mode={mode}
							onGenerate={handleGenerate}
							onBack={handleBack}
						/>
					</motion.div>
				)}

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
	onGenerate: (canvas: HTMLCanvasElement) => void;
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
	generatedPackage,
	onBackToEditor,
	onReset,
	onGenerated,
}: {
	sourceCanvas: HTMLCanvasElement;
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
