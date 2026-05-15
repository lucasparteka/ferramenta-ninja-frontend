"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutB } from "@/components/shared/layout-b";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";

const OG_TYPES = [
	{ value: "website", label: "Website" },
	{ value: "article", label: "Artigo" },
	{ value: "profile", label: "Perfil" },
];

export function MetaTagGenerator() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [url, setUrl] = useState("");
	const [image, setImage] = useState("");
	const [type, setType] = useState("website");
	const [author, setAuthor] = useState("");
	const [keywords, setKeywords] = useState("");

	const html = generateMetaHTML({
		title,
		description,
		url,
		image,
		type,
		author,
		keywords,
	});

	const hasContent = !!(title || description);

	return (
		<LayoutB
			form={
				<div className="rounded-md border border-border bg-card overflow-hidden">
					<div className="divide-y divide-border">
						<div className="p-4">
							<SectionLabel>Informações básicas</SectionLabel>
							<div className="space-y-3">
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<label
											htmlFor="meta-title"
											className="text-xs font-medium text-foreground"
										>
											Título da página
										</label>
										<span className="font-mono text-caption tabular-nums text-muted-foreground">
											{title.length}/60
										</span>
									</div>
									<Input
										id="meta-title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Meu Site"
										maxLength={60}
									/>
								</div>

								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<label
											htmlFor="meta-desc"
											className="text-xs font-medium text-foreground"
										>
											Meta descrição
										</label>
										<span className="font-mono text-caption tabular-nums text-muted-foreground">
											{description.length}/160
										</span>
									</div>
									<Textarea
										id="meta-desc"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Descrição breve do conteúdo da página..."
										className="min-h-20"
										maxLength={160}
									/>
								</div>

								<div className="space-y-1.5">
									<label
										htmlFor="meta-url"
										className="text-xs font-medium text-foreground"
									>
										URL da página
									</label>
									<Input
										id="meta-url"
										type="url"
										value={url}
										onChange={(e) => setUrl(e.target.value)}
										placeholder="https://www.exemplo.com.br/pagina"
									/>
								</div>

								<div className="space-y-1.5">
									<label
										htmlFor="meta-image"
										className="text-xs font-medium text-foreground"
									>
										Imagem OG (URL)
									</label>
									<Input
										id="meta-image"
										type="url"
										value={image}
										onChange={(e) => setImage(e.target.value)}
										placeholder="https://www.exemplo.com.br/imagem.jpg"
									/>
								</div>
							</div>
						</div>

						<div className="p-4">
							<SectionLabel>Configuração</SectionLabel>
							<div className="space-y-3">
								<div className="space-y-1.5">
									<label
										htmlFor="meta-type"
										className="text-xs font-medium text-foreground"
									>
										Tipo de conteúdo
									</label>
									<NativeSelect
										id="meta-type"
										value={type}
										onChange={(e) => setType(e.target.value)}
									>
										{OG_TYPES.map((t) => (
											<option key={t.value} value={t.value}>
												{t.label}
											</option>
										))}
									</NativeSelect>
								</div>

								<div className="space-y-1.5">
									<label
										htmlFor="meta-author"
										className="text-xs font-medium text-foreground"
									>
										Autor
									</label>
									<Input
										id="meta-author"
										value={author}
										onChange={(e) => setAuthor(e.target.value)}
										placeholder="Nome do autor"
									/>
								</div>

								<div className="space-y-1.5">
									<label
										htmlFor="meta-keywords"
										className="text-xs font-medium text-foreground"
									>
										Palavras-chave
									</label>
									<Input
										id="meta-keywords"
										value={keywords}
										onChange={(e) => setKeywords(e.target.value)}
										placeholder="palavra1, palavra2, palavra3"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-end border-t border-border bg-muted/40 px-4 py-3">
						<CopyButton
							text={html}
							label="Copiar código"
							variant="outline"
							size="sm"
							disabled={!html}
						/>
					</div>
				</div>
			}
			result={
				!hasContent ? (
					<div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
						<p className="text-sm text-muted-foreground">
							Preencha os campos para gerar as meta tags
						</p>
					</div>
				) : (
					<>
						<div className="space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Google
							</h3>
							{/* Cores hardcoded são intencionais — simulam a UI real do Google */}
							<div className="rounded-md border border-border bg-card p-3 space-y-0.5">
								<p className="truncate text-sm text-[#1a0dab] dark:text-[#8ab4f8]">
									{title || "Título da página"}
								</p>
								<p className="truncate text-xs text-[#006621] dark:text-[#34a853]">
									{url || "www.exemplo.com.br › pagina"}
								</p>
								<p className="text-xs leading-snug text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
									{description || "Descrição do conteúdo da página..."}
								</p>
							</div>
						</div>

						<div className="space-y-2 border-t border-border pt-4">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Open Graph
							</h3>
							{/* Cores hardcoded são intencionais — simulam a UI do Facebook/LinkedIn */}
							<div className="overflow-hidden rounded-md border border-border">
								{image ? (
									// biome-ignore lint/performance/noImgElement: preview
									<img
										src={image}
										alt="OG preview"
										className="h-36 w-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
										}}
									/>
								) : (
									<div className="flex h-36 w-full items-center justify-center bg-muted text-xs text-muted-foreground">
										Sem imagem
									</div>
								)}
								<div className="bg-[#f0f2f5] p-3 dark:bg-[#3a3b3c]">
									<p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
										{url ? safeHostname(url) : "exemplo.com.br"}
									</p>
									<p className="mt-0.5 truncate text-xs font-semibold text-foreground">
										{title || "Título"}
									</p>
									<p className="truncate text-xs text-muted-foreground">
										{description || "Descrição"}
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-2 border-t border-border pt-4">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Código HTML
							</h3>
							<pre className="overflow-auto max-h-48 rounded-md border border-border bg-muted/20 p-3 font-mono text-caption leading-relaxed text-foreground select-all whitespace-pre-wrap break-all">
								{html}
							</pre>
							<CopyButton
								text={html}
								label="Copiar código"
								variant="outline"
								size="sm"
								disabled={!html}
								className="w-full"
							/>
						</div>
					</>
				)
			}
		/>
	);
}

function safeHostname(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
}

function generateMetaHTML({
	title,
	description,
	url,
	image,
	type,
	author,
	keywords,
}: {
	title: string;
	description: string;
	url: string;
	image: string;
	type: string;
	author: string;
	keywords: string;
}): string {
	const lines: string[] = [];
	if (title) lines.push(`<title>${escapeHtml(title)}</title>`);
	if (description)
		lines.push(
			`<meta name="description" content="${escapeHtml(description)}">`,
		);
	if (keywords)
		lines.push(`<meta name="keywords" content="${escapeHtml(keywords)}">`);
	if (author)
		lines.push(`<meta name="author" content="${escapeHtml(author)}">`);
	lines.push(`<meta charset="UTF-8">`);
	lines.push(
		`<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
	);
	if (title)
		lines.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
	if (description)
		lines.push(
			`<meta property="og:description" content="${escapeHtml(description)}">`,
		);
	if (url) lines.push(`<meta property="og:url" content="${escapeHtml(url)}">`);
	if (image)
		lines.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
	lines.push(`<meta property="og:type" content="${type}">`);
	if (title)
		lines.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
	if (description)
		lines.push(
			`<meta name="twitter:description" content="${escapeHtml(description)}">`,
		);
	if (image)
		lines.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`);
	lines.push(`<meta name="twitter:card" content="summary_large_image">`);
	return lines.join("\n");
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
