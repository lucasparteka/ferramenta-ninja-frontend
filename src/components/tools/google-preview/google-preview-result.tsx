"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import Image from "next/image";
import { formatDisplayUrl, getDomain } from "@/lib/seo/format-url";

type Props = {
	title: string;
	description: string;
	url: string;
	keyword?: string;
};

type PreviewTab = "desktop" | "mobile";

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
	if (!keyword.trim()) return <>{text}</>;

	const regex = new RegExp(`(${escapeRegex(keyword)})`, "gi");
	const parts = text.split(regex);

	let offset = 0;
	return (
		<>
			{parts.map((part) => {
				const start = offset;
				offset += part.length;
				const key = `${start}-${offset}`;
				if (part.toLowerCase() === keyword.toLowerCase()) {
					return <strong key={key}>{part}</strong>;
				}
				return <span key={key}>{part}</span>;
			})}
		</>
	);
}

function Favicon({ url }: { url: string }) {
	const domain = getDomain(url);

	if (!domain) {
		return <div className="h-4.5 w-4.5 shrink-0 rounded-full bg-gray-200" />;
	}

	return (
		<Image
			src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
			alt=""
			width={18}
			height={18}
			className="h-4.5 w-4.5 shrink-0 rounded-sm"
		/>
	);
}

type SnippetProps = {
	title: string;
	description: string;
	url: string;
	keyword: string;
	mobile: boolean;
};

function GoogleSnippet({ title, description, url, keyword, mobile }: SnippetProps) {
	const displayUrl = formatDisplayUrl(url);
	const domain = getDomain(url);

	const isEmpty = !title && !description && !url;

	const titleText =
		title || "Título da sua página aparece aqui";
	const descText =
		description ||
		"A meta descrição da sua página aparece aqui. Use este espaço para convencer o usuário a clicar no seu resultado nos mecanismos de busca.";

	return (
		<div
			className="rounded-xl border border-[#dfe1e5] bg-white p-4 shadow-sm"
			style={{
				maxWidth: mobile ? 360 : 600,
				fontFamily: "arial, sans-serif",
			}}
		>
			<div className="mb-1 flex items-center gap-2">
				<Favicon url={url} />
				<div className="min-w-0 flex-1">
					<div
						className="truncate text-sm font-medium leading-tight"
						style={{ color: "#202124" }}
					>
						{domain || "seusite.com"}
					</div>
					<div
						className="truncate text-xs leading-tight"
						style={{ color: "#4d5156" }}
					>
						{displayUrl || "seusite.com › pagina › subpagina"}
					</div>
				</div>
			</div>

			<div
				className={`mt-1 cursor-pointer font-normal leading-snug hover:underline ${mobile ? "text-lg" : "text-xl"} ${isEmpty ? "italic opacity-40" : ""}`}
				style={{ color: "#1a0dab" }}
			>
				<HighlightedText text={titleText} keyword={keyword} />
			</div>

			<p
				className={`mt-1 line-clamp-2 text-sm leading-snug ${isEmpty ? "italic opacity-40" : ""}`}
				style={{ color: "#4d5156" }}
			>
				<HighlightedText text={descText} keyword={keyword} />
			</p>
		</div>
	);
}

export function GooglePreviewResult({
	title,
	description,
	url,
	keyword = "",
}: Props) {
	const [tab, setTab] = useState<PreviewTab>("desktop");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center border-b border-border">
				<button
					type="button"
					onClick={() => setTab("desktop")}
					className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
						tab === "desktop"
							? "border-primary text-foreground"
							: "border-transparent text-muted-foreground hover:text-foreground"
					}`}
				>
					<Monitor className="h-4 w-4" />
					Desktop
				</button>
				<button
					type="button"
					onClick={() => setTab("mobile")}
					className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
						tab === "mobile"
							? "border-primary text-foreground"
							: "border-transparent text-muted-foreground hover:text-foreground"
					}`}
				>
					<Smartphone className="h-4 w-4" />
					Mobile
				</button>
			</div>

			<div className="overflow-x-auto">
				<GoogleSnippet
					title={title}
					description={description}
					url={url}
					keyword={keyword}
					mobile={tab === "mobile"}
				/>
			</div>

			<p className="text-xs text-muted-foreground">
				O Google pode exibir um título ou descrição diferente com base no
				conteúdo da página e na consulta do usuário.
			</p>
		</div>
	);
}
