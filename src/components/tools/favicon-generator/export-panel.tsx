"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
	Package,
	Download,
	Code,
	FileJson,
	Loader2,
	ChevronDown,
	ChevronUp,
	Check,
	FileArchive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import {
	createZipPackage,
	createWebManifest,
	generateHtmlTags,
	type GeneratedFaviconFile,
} from "@/lib/image/favicon";

interface ExportPanelProps {
	files: GeneratedFaviconFile[];
	icoBlob: Blob;
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function ExportPanel({ files, icoBlob }: ExportPanelProps) {
	const [zipLoading, setZipLoading] = useState(false);
	const [manifestOpen, setManifestOpen] = useState(false);
	const [downloadedFiles, setDownloadedFiles] = useState<Set<string>>(
		new Set(),
	);

	const handleDownloadZip = useCallback(async () => {
		setZipLoading(true);
		try {
			const zipFiles = [
				...files.map((f) => ({ name: f.name, blob: f.blob })),
				{ name: "favicon.ico", blob: icoBlob },
				{
					name: "site.webmanifest",
					blob: new Blob([createWebManifest()], {
						type: "application/json",
					}),
				},
			];
			const zipBlob = await createZipPackage(zipFiles);
			downloadBlob(zipBlob, "favicon-package.zip");
		} finally {
			setZipLoading(false);
		}
	}, [files, icoBlob]);

	const handleDownloadIndividual = useCallback(
		(blob: Blob, filename: string) => {
			downloadBlob(blob, filename);
			setDownloadedFiles((prev) => new Set(prev).add(filename));
		},
		[],
	);

	const htmlTags = generateHtmlTags();
	const manifestJson = createWebManifest();

	const allFiles = [
		...files.map((f) => ({
			name: f.name,
			blob: f.blob,
			dataUrl: f.dataUrl,
			label: `${f.width}×${f.height}`,
		})),
		{
			name: "favicon.ico",
			blob: icoBlob,
			dataUrl: null as string | null,
			label: "Multi-resolução",
		},
	];

	return (
		<div className="space-y-6">
			{/* Section 1: Download .zip */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}
				className="rounded-xl border bg-card p-6"
			>
				<div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Package className="h-6 w-6" />
					</div>
					<div className="flex-1">
						<h3 className="text-base font-semibold text-foreground">
							Baixar pacote completo
						</h3>
						<p className="text-sm text-muted-foreground">
							Inclui todos os PNGs, .ico e site.webmanifest em um único arquivo
						</p>
					</div>
					<Button
						onClick={handleDownloadZip}
						disabled={zipLoading}
						className="shrink-0"
					>
						{zipLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<FileArchive className="mr-2 h-4 w-4" />
						)}
						{zipLoading ? "Criando pacote..." : "Baixar favicon-package.zip"}
					</Button>
				</div>
			</motion.div>

			{/* Section 2: Individual downloads */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}
				className="rounded-xl border bg-card p-6"
			>
				<h3 className="mb-4 text-base font-semibold text-foreground">
					Downloads individuais
				</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					{allFiles.map((file) => {
						const isDownloaded = downloadedFiles.has(file.name);
						return (
							<div
								key={file.name}
								className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
							>
								{file.dataUrl ? (
									<img
										src={file.dataUrl}
										alt=""
										className="h-6 w-6 rounded object-contain"
										style={{
											imageRendering:
												file.name.includes("16") || file.name.includes("32")
													? "pixelated"
													: "auto",
										}}
									/>
								) : (
									<div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
										ICO
									</div>
								)}
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-foreground">
										{file.name}
									</p>
									<p className="text-xs text-muted-foreground">{file.label}</p>
								</div>
								<Button
									size="icon-sm"
									variant="outline"
									onClick={() => handleDownloadIndividual(file.blob, file.name)}
									aria-label={`Baixar ${file.name}`}
								>
									{isDownloaded ? (
										<Check className="h-4 w-4 text-green-500" />
									) : (
										<Download className="h-4 w-4" />
									)}
								</Button>
							</div>
						);
					})}
				</div>
			</motion.div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Section 3: HTML Tags */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.3 }}
					className="rounded-xl border bg-card p-6"
				>
					<div className="mb-3 flex items-center gap-2">
						<Code className="h-4 w-4 text-muted-foreground" />
						<h3 className="text-base font-semibold text-foreground">
							Tags HTML
						</h3>
					</div>
					<p className="mb-3 text-sm text-muted-foreground">
						Copie e cole dentro da tag{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">
							&lt;head&gt;
						</code>{" "}
						do seu site
					</p>
					<div className="relative">
						<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
							<code>{htmlTags}</code>
						</pre>
						<div className="absolute top-2 right-2">
							<CopyButton
								text={htmlTags}
								label="Copiar"
								variant="secondary"
								size="xs"
							/>
						</div>
					</div>
				</motion.div>

				{/* Section 4: Manifest */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.35 }}
					className="rounded-xl border bg-card p-6"
				>
					<button
						type="button"
						onClick={() => setManifestOpen((o) => !o)}
						className="flex w-full items-center justify-between"
						aria-expanded={manifestOpen}
					>
						<div className="flex items-center gap-2">
							<FileJson className="h-4 w-4 text-muted-foreground" />
							<h3 className="text-base font-semibold text-foreground">
								site.webmanifest
							</h3>
						</div>
						{manifestOpen ? (
							<ChevronUp className="h-4 w-4 text-muted-foreground" />
						) : (
							<ChevronDown className="h-4 w-4 text-muted-foreground" />
						)}
					</button>
					<p className="mt-1 text-left text-sm text-muted-foreground">
						JSON para Progressive Web App (PWA)
					</p>

					{manifestOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							transition={{ duration: 0.2 }}
							className="mt-3 overflow-hidden"
						>
							<div className="relative">
								<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
									<code>{manifestJson}</code>
								</pre>
								<div className="absolute top-2 right-2">
									<CopyButton
										text={manifestJson}
										label="Copiar"
										variant="secondary"
										size="xs"
									/>
								</div>
							</div>
						</motion.div>
					)}
				</motion.div>
			</div>

			{/* Instructions */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.4 }}
				className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground"
			>
				<p>
					💡 <strong>Como usar:</strong> coloque os arquivos na raiz do seu site
					e cole as tags HTML dentro da tag{" "}
					<code className="rounded bg-muted px-1 py-0.5 text-xs">
						&lt;head&gt;
					</code>
					.
				</p>
			</motion.div>
		</div>
	);
}
