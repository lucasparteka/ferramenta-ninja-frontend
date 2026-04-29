"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
	const [copied, setCopied] = useState(false);

	const html = generateMetaHTML({
		title,
		description,
		url,
		image,
		type,
		author,
		keywords,
	});

	function handleCopy() {
		if (!html) return;
		navigator.clipboard.writeText(html);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="space-y-6">
			<div className="max-w-2xl space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="meta-title"
						className="block text-sm font-medium text-foreground"
					>
						Título da página
					</label>
					<Input
						id="meta-title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Meu Site Incrível"
						className="text-foreground"
						maxLength={60}
					/>
					<p className="text-xs text-muted-foreground">
						{title.length}/60 caracteres
					</p>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="meta-desc"
						className="block text-sm font-medium text-foreground"
					>
						Meta descrição
					</label>
					<Textarea
						id="meta-desc"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Descrição breve do conteúdo da página..."
						className="min-h-[80px] text-foreground"
						maxLength={160}
					/>
					<p className="text-xs text-muted-foreground">
						{description.length}/160 caracteres
					</p>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="meta-url"
						className="block text-sm font-medium text-foreground"
					>
						URL da página
					</label>
					<Input
						id="meta-url"
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://www.exemplo.com.br/pagina"
						className="text-foreground"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="meta-image"
						className="block text-sm font-medium text-foreground"
					>
						Imagem OG (URL)
					</label>
					<Input
						id="meta-image"
						type="url"
						value={image}
						onChange={(e) => setImage(e.target.value)}
						placeholder="https://www.exemplo.com.br/imagem.jpg"
						className="text-foreground"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="meta-type"
						className="block text-sm font-medium text-foreground"
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

				<div className="space-y-2">
					<label
						htmlFor="meta-author"
						className="block text-sm font-medium text-foreground"
					>
						Autor
					</label>
					<Input
						id="meta-author"
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder="Nome do autor"
						className="text-foreground"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="meta-keywords"
						className="block text-sm font-medium text-foreground"
					>
						Palavras-chave
					</label>
					<Input
						id="meta-keywords"
						value={keywords}
						onChange={(e) => setKeywords(e.target.value)}
						placeholder="palavra1, palavra2, palavra3"
						className="text-foreground"
					/>
				</div>
			</div>

			{(title || description) && (
				<div className="max-w-2xl space-y-4">
					<h3 className="text-sm font-medium text-foreground">Previews</h3>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Google</p>
						<div className="rounded-lg border border-border bg-card p-4">
							<p className="truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">
								{title || "Título da página"}
							</p>
							<p className="truncate text-sm text-[#006621] dark:text-[#34a853]">
								{url || "www.exemplo.com.br › pagina"}
							</p>
							<p className="mt-0.5 text-sm leading-snug text-[#4d5156] dark:text-[#bdc1c6]">
								{description || "Descrição do conteúdo da página..."}
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">
							Facebook / Open Graph
						</p>
						<div className="max-w-sm overflow-hidden rounded-lg border border-border">
							{image ? (
								// biome-ignore lint/performance/noImgElement: preview
								<img
									src={image}
									alt="OG preview"
									className="h-40 w-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).style.display = "none";
									}}
								/>
							) : (
								<div className="flex h-40 w-full items-center justify-center bg-muted text-sm text-muted-foreground">
									Sem imagem
								</div>
							)}
							<div className="bg-[#f0f2f5] p-3 dark:bg-[#3a3b3c]">
								<p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
									{url ? new URL(url).hostname : "exemplo.com.br"}
								</p>
								<p className="mt-0.5 truncate text-sm font-semibold text-foreground">
									{title || "Título"}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{description || "Descrição"}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="max-w-2xl space-y-2">
				<label
					htmlFor="meta-html"
					className="block text-sm font-medium text-foreground"
				>
					Código HTML gerado
				</label>
				<Textarea
					id="meta-html"
					value={html || "Preencha os campos acima para gerar o código."}
					readOnly
					className="min-h-[280px] font-mono text-sm text-foreground"
					spellCheck={false}
				/>
				<Button onClick={handleCopy} disabled={!html} variant="outline">
					<Copy className="mr-2 h-4 w-4" />
					{copied ? "Copiado!" : "Copiar código"}
				</Button>
			</div>
		</div>
	);
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
