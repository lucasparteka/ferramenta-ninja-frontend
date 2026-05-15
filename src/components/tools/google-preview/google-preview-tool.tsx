"use client";

import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { LayoutD } from "@/components/shared/layout-d";
import { LimitBar } from "@/components/shared/limit-bar";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDescriptionStatus, getTitleStatus } from "@/lib/seo/seo-preview";
import { GooglePreviewResult } from "./google-preview-result";
import { GooglePreviewUrl } from "./google-preview-url";

type PreviewData = {
	title: string;
	description: string;
	url: string;
	keyword: string;
};

export function GooglePreviewTool() {
	const [data, setData] = useState<PreviewData>({
		title: "",
		description: "",
		url: "",
		keyword: "",
	});

	const { title, description, url, keyword } = data;

	const titleStatus = getTitleStatus(title.length);
	const descStatus = getDescriptionStatus(description.length);

	function update(partial: Partial<PreviewData>) {
		setData((prev) => ({ ...prev, ...partial }));
	}

	function handleUrlLoad(loaded: {
		title: string;
		description: string;
		url: string;
	}) {
		setData((prev) => ({
			...prev,
			title: loaded.title ?? "",
			description: loaded.description ?? "",
			url: loaded.url ?? "",
		}));
	}

	function handleClear() {
		setData({ title: "", description: "", url: "", keyword: "" });
	}

	async function handleCopySnippet() {
		const snippet = `${title || "Título da página"}\n${url || "seusite.com"}\n${description || "Descrição da página"}`;
		await navigator.clipboard.writeText(snippet);
	}

	const hasContent = title || description || url;

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Prévia do Google"
					badge="TEMPO REAL"
					actions={
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopySnippet}
								disabled={!title && !description && !url}
							>
								<Copy className="mr-1.5 h-3 w-3" />
								Copiar
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Limpar"
								onClick={handleClear}
								disabled={!hasContent}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</>
					}
				/>
			}
			sidebar={
				<>
					<SidebarSection title="Título">
						<LimitBar
							label="Título"
							current={title.length}
							min={30}
							max={60}
							status={titleStatus}
						/>
					</SidebarSection>
					<SidebarSection title="Descrição">
						<LimitBar
							label="Descrição"
							current={description.length}
							min={120}
							max={160}
							status={descStatus}
						/>
					</SidebarSection>
					<SidebarSection title="Palavra-chave">
						<input
							id="preview-keyword"
							value={keyword}
							onChange={(e) => update({ keyword: e.target.value })}
							placeholder="palavra para destacar"
							className="w-full rounded-md border border-border bg-transparent px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground/30"
						/>
					</SidebarSection>
					<SidebarSection title="Referências">
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">Título</span>
							<span className="font-mono text-[11px] bg-card border border-border rounded px-1.5 py-0.5 text-muted-foreground">
								30–60 caracteres
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">Descrição</span>
							<span className="font-mono text-[11px] bg-card border border-border rounded px-1.5 py-0.5 text-muted-foreground">
								120–160 caracteres
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">URL</span>
							<span className="font-mono text-[11px] bg-card border border-border rounded px-1.5 py-0.5 text-muted-foreground">
								limpa e descritiva
							</span>
						</div>
					</SidebarSection>
				</>
			}
		>
			<div className="flex flex-col">
				<div className="p-4 border-b border-border space-y-4">
					<GooglePreviewUrl onLoad={handleUrlLoad} />
					<div className="relative flex items-center gap-3">
						<div className="h-px flex-1 bg-border" />
						<span className="text-xs text-muted-foreground">
							ou insira manualmente
						</span>
						<div className="h-px flex-1 bg-border" />
					</div>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label
								htmlFor="preview-title"
								className="text-xs text-muted-foreground"
							>
								Título
							</Label>
							<Input
								id="preview-title"
								placeholder="Título da página"
								value={title}
								onChange={(e) => update({ title: e.target.value })}
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="preview-description"
								className="text-xs text-muted-foreground"
							>
								Meta descrição
							</Label>
							<Textarea
								id="preview-description"
								placeholder="Descrição da página para os mecanismos de busca"
								value={description}
								onChange={(e) => update({ description: e.target.value })}
								className="min-h-20 resize-none"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="preview-url"
								className="text-xs text-muted-foreground"
							>
								URL
							</Label>
							<Input
								id="preview-url"
								type="url"
								placeholder="https://seusite.com/pagina"
								value={url}
								onChange={(e) => update({ url: e.target.value })}
							/>
						</div>
					</div>
				</div>
				<div className="flex-1 p-4">
					<GooglePreviewResult
						title={title}
						description={description}
						url={url}
						keyword={keyword}
					/>
				</div>
			</div>

			<StatusBar
				items={[
					{
						label: "",
						value: hasContent
							? `Título: ${title.length} · Descrição: ${description.length}`
							: "Aguardando",
						mono: false,
						variant: hasContent ? "success" : "default",
					},
				]}
			/>
		</LayoutD>
	);
}
