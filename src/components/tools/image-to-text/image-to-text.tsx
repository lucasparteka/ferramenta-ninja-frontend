"use client";

import { useState } from "react";
import { extractTextFromImage } from "@/lib/ocr/extract";
import { ImageUpload } from "./image-upload";
import { OcrControls } from "./ocr-controls";
import { OcrOutput } from "./ocr-output";

type OcrState = "idle" | "loading" | "success" | "error";
type OcrLanguage = "por" | "eng" | "spa";

export function ImageToText() {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState("");
	const [language, setLanguage] = useState<OcrLanguage>("por");
	const [state, setState] = useState<OcrState>("idle");
	const [result, setResult] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [progress, setProgress] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	function processFile(selected: File) {
		const allowed = ["image/png", "image/jpeg", "image/webp"];
		if (!allowed.includes(selected.type)) {
			setState("error");
			setErrorMsg(
				"O arquivo selecionado não é uma imagem válida. Use PNG, JPG ou WebP.",
			);
			return;
		}
		setFile(selected);
		setPreview(URL.createObjectURL(selected));
		setState("idle");
		setResult("");
		setErrorMsg("");
		setProgress(0);
	}

	function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(true);
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	async function handleExtract() {
		if (!file) return;
		setState("loading");
		setResult("");
		setErrorMsg("");
		setProgress(0);
		try {
			const text = await extractTextFromImage(file, language, setProgress);
			setResult(text);
			setState("success");
		} catch (e) {
			setState("error");
			setErrorMsg(e instanceof Error ? e.message : "Erro ao processar imagem.");
		}
	}

	function handleClear() {
		setFile(null);
		setPreview("");
		setState("idle");
		setResult("");
		setErrorMsg("");
		setProgress(0);
	}

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="flex flex-col gap-4 sm:flex-1">
				<ImageUpload
					preview={preview}
					isDragging={isDragging}
					onFile={processFile}
					onClear={handleClear}
					onDragOver={handleDragOver}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
				/>
				<OcrControls
					language={language}
					disabled={!file || state === "loading"}
					onLanguageChange={setLanguage}
					onExtract={handleExtract}
				/>
			</div>
			<div className="flex flex-col sm:flex-1">
				<OcrOutput
					state={state}
					result={result}
					errorMsg={errorMsg}
					progress={progress}
					onChange={setResult}
				/>
			</div>
		</div>
	);
}
