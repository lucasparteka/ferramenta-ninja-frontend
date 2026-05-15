"use client";

/* ------------------------------------------------------------------ */
/*  ExportPanel — sem mudanças funcionais; apenas tipografia/cabeçalho */
/*  ajustados para combinar com o ResultPanel persistente.             */
/* ------------------------------------------------------------------ */

import { motion } from "framer-motion";
import {
	Check,
	ChevronDown,
	ChevronUp,
	Code,
	Download,
	FileArchive,
	FileJson,
	Loader2,
	Package,
} from "lucide-react";
import { useCallback, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import {
	createWebManifest,
	createZipPackage,
	type GeneratedFaviconFile,
	generateHtmlTags,
} from "@/lib/image/favicon";
import { cn } from "@/lib/utils";

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
					blob: new Blob([createWebManifest()], { type: "application/json" }),
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
		<div className="space-y-5">
			{/* ZIP */}
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25 }}
				className="flex flex-col items-center gap-3 rounded-lg border bg-background p-5 sm:flex-row sm:text-left"
			>
				<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Package className="h-5 w-5" />
				</div>
				<div className="flex-1 text-center sm:text-left">
					<h3 className="text-sm font-semibold text-foreground">
						Pacote completo
					</h3>
					<p className="text-xs text-muted-foreground">
						6 PNGs + favicon.ico + site.webmanifest
					</p>
				</div>
				<Button
					onClick={handleDownloadZip}
					disabled={zipLoading}
					variant="outline"
				>
					{zipLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<FileArchive className="mr-2 h-4 w-4" />
					)}
					{zipLoading ? "Criando..." : "Baixar .zip"}
				</Button>
			</motion.div>

			{/* Individual */}
			<div>
				<h3 className="mb-2 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
					Downloads individuais
				</h3>
				<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{allFiles.map((file, i) => {
						const isDownloaded = downloadedFiles.has(file.name);
						return (
							<div
								key={file.name}
								className="flex items-center gap-2.5 rounded-lg border bg-background p-2.5"
							>
								{file.dataUrl ? (
									// biome-ignore lint/performance/noImgElement: .
									<img
										src={file.dataUrl}
										alt=""
										className={cn(
											"rounded object-contain",
											i === 0 ? "size-4 mx-1" : "size-5",
										)}
									/>
								) : (
									<div className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[9px] font-semibold text-muted-foreground">
										ICO
									</div>
								)}
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-medium text-foreground">
										{file.name}
									</p>
									<p className="text-[10px] text-muted-foreground">
										{file.label}
									</p>
								</div>
								<Button
									size="icon-sm"
									variant="outline"
									onClick={() => handleDownloadIndividual(file.blob, file.name)}
									aria-label={`Baixar ${file.name}`}
								>
									{isDownloaded ? (
										<Check className="h-3.5 w-3.5 text-success" />
									) : (
										<Download className="h-3.5 w-3.5" />
									)}
								</Button>
							</div>
						);
					})}
				</div>
			</div>

			{/* HTML + manifest */}
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="rounded-lg border bg-background p-4 overflow-x-auto">
					<div className="mb-2 flex items-center gap-2">
						<Code className="h-4 w-4 text-muted-foreground" />
						<h3 className="text-sm font-semibold text-foreground">Tags HTML</h3>
					</div>
					<p className="mb-2 text-xs text-muted-foreground">
						Cole dentro de{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-[10px]">
							&lt;head&gt;
						</code>
					</p>
					<div className="my-2 flex justify-end w-full">
						<CopyButton
							text={htmlTags}
							label="Copiar"
							variant="secondary"
							size="xs"
						/>
					</div>
					<div className="min-w-0">
						<pre className="overflow-x-auto rounded-lg bg-muted p-3 text-caption text-muted-foreground">
							<code>{htmlTags}</code>
						</pre>
					</div>
				</div>

				<div className="rounded-lg border bg-background p-4 overflow-x-auto">
					<button
						type="button"
						onClick={() => setManifestOpen((o) => !o)}
						className="flex w-full items-center justify-between"
						aria-expanded={manifestOpen}
					>
						<div className="flex items-center gap-2">
							<FileJson className="h-4 w-4 text-muted-foreground" />
							<h3 className="text-sm font-semibold text-foreground">
								site.webmanifest
							</h3>
						</div>
						{manifestOpen ? (
							<ChevronUp className="h-4 w-4 text-muted-foreground" />
						) : (
							<ChevronDown className="h-4 w-4 text-muted-foreground" />
						)}
					</button>
					<p className="mt-1 text-left text-xs text-muted-foreground">
						JSON para PWA
					</p>
					<div className="w-full flex justify-end">
						<CopyButton
							text={manifestJson}
							label="Copiar"
							variant="secondary"
							size="xs"
						/>
					</div>
					{manifestOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							transition={{ duration: 0.2 }}
							className="mt-3 overflow-hidden"
						>
							<div className="min-w-0">
								<pre className="overflow-x-auto rounded-lg bg-muted p-3 text-caption text-muted-foreground">
									<code>{manifestJson}</code>
								</pre>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}
