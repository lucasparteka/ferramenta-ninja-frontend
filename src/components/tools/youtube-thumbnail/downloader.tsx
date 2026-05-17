"use client";

import { Clapperboard, Download, ExternalLink, Search, X } from "lucide-react";
import { useId, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	extractVideoId,
	getThumbnailQualities,
	type ThumbnailQuality,
} from "@/lib/youtube/thumbnail";

type DownloadState = Record<string, "idle" | "loading" | "done" | "error">;

export function YouTubeThumbnailDownloader() {
	const uid = useId();
	const [url, setUrl] = useState("");
	const [qualities, setQualities] = useState<ThumbnailQuality[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [downloadState, setDownloadState] = useState<DownloadState>({});

	const videoId = extractVideoId(url);

	function handleSearch() {
		if (!videoId) {
			setError("URL do YouTube inválida. Cole um link como youtube.com/watch?v=... ou youtu.be/...");
			setQualities(null);
			return;
		}
		setError(null);
		setDownloadState({});
		setQualities(getThumbnailQualities(videoId));
	}

	function handleClear() {
		setUrl("");
		setQualities(null);
		setError(null);
		setDownloadState({});
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleSearch();
	}

	async function handleDownload(quality: ThumbnailQuality) {
		setDownloadState((s) => ({ ...s, [quality.key]: "loading" }));
		try {
			const proxyUrl = `/api/youtube-thumbnail?url=${encodeURIComponent(quality.url)}`;
			const res = await fetch(proxyUrl);
			if (!res.ok) throw new Error("Falha no download");
			const blob = await res.blob();
			const objectUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = objectUrl;
			a.download = `thumbnail-${videoId}-${quality.key}.jpg`;
			a.click();
			URL.revokeObjectURL(objectUrl);
			setDownloadState((s) => ({ ...s, [quality.key]: "done" }));
		} catch {
			setDownloadState((s) => ({ ...s, [quality.key]: "error" }));
		}
	}

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Baixar Thumbnail do YouTube"
					badge="YOUTUBE"
					actions={
						qualities ? (
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={handleClear}
							>
								<X className="mr-1.5 h-3.5 w-3.5" />
								Limpar
							</Button>
						) : (
							<Button
								type="button"
								size="sm"
								onClick={handleSearch}
								disabled={!url.trim()}
							>
								<Search className="mr-1.5 h-3.5 w-3.5" />
								Buscar
							</Button>
						)
					}
				/>
			}
			sidebar={
				<div className="p-4 space-y-3">
					<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						Formatos suportados
					</h3>
					<ul className="text-xs text-muted-foreground space-y-1.5">
						<li>youtube.com/watch?v=...</li>
						<li>youtu.be/...</li>
						<li>youtube.com/shorts/...</li>
						<li>youtube.com/embed/...</li>
					</ul>
					<p className="text-[11px] text-muted-foreground/70 pt-2 border-t border-border">
						As thumbnails são imagens públicas do YouTube. Verifique os direitos autorais antes de uso comercial.
					</p>
				</div>
			}
			sidebarWidth={220}
		>
			<div className="space-y-6 p-4">
				<div className="space-y-1">
					<Label
						htmlFor={`${uid}-url`}
						className="text-[10px] uppercase tracking-wider text-muted-foreground"
					>
						URL do vídeo
					</Label>
					<div className="flex gap-2">
						<Input
							id={`${uid}-url`}
							type="url"
							value={url}
							onChange={(e) => {
								setUrl(e.target.value);
								setError(null);
								setQualities(null);
								setDownloadState({});
							}}
							onKeyDown={handleKeyDown}
							placeholder="https://www.youtube.com/watch?v=..."
							className="flex-1"
						/>
					</div>
					{error && <p className="text-xs text-destructive">{error}</p>}
				</div>

				{qualities && (
					<div className="space-y-3">
						<p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
							Resoluções disponíveis
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{qualities.map((q) => (
								<div
									key={q.key}
									className="rounded-md border border-border overflow-hidden bg-background"
								>
									{/** biome-ignore lint/performance/noImgElement: thumbnail preview */}
									<img
										src={q.url}
										alt={`Thumbnail ${q.label}`}
										width={q.width}
										height={q.height}
										className="w-full aspect-video object-cover bg-muted"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
										}}
									/>
									<div className="p-2.5 flex items-center justify-between gap-2">
										<div>
											<p className="text-xs font-medium">{q.label}</p>
											<p className="text-[11px] text-muted-foreground">
												{q.width}×{q.height}
											</p>
										</div>
										<div className="flex gap-1.5 shrink-0">
											<CopyButton
												text={q.url}
												iconOnly
												size="sm"
												variant="outline"
											/>
											<Button
												type="button"
												size="sm"
												variant="outline"
												onClick={() =>
													window.open(q.url, "_blank", "noopener,noreferrer")
												}
											>
												<ExternalLink className="h-3.5 w-3.5" />
											</Button>
											<Button
												type="button"
												size="sm"
												onClick={() => handleDownload(q)}
												disabled={downloadState[q.key] === "loading"}
											>
												<Download className="mr-1 h-3.5 w-3.5" />
												{downloadState[q.key] === "loading"
													? "..."
													: downloadState[q.key] === "error"
														? "Erro"
														: "Baixar"}
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>

						<p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
							<Clapperboard className="h-3.5 w-3.5 shrink-0" />
							ID do vídeo: <code className="font-mono">{videoId}</code>
						</p>
					</div>
				)}

				{!qualities && !error && (
					<div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
						<Clapperboard className="h-10 w-10 opacity-20" />
						<p className="text-sm">Cole uma URL e clique em Buscar</p>
					</div>
				)}
			</div>
		</LayoutD>
	);
}
