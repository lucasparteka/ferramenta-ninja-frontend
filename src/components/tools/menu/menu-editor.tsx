/** biome-ignore-all lint/suspicious/noArrayIndexKey: items fixed */
"use client";

import { Form, ListPlus } from "lucide-react";
import { useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportMenuPdf, exportMenuPng } from "@/lib/menu/export";
import { MENU_TEMPLATES } from "@/lib/menu/templates";
import type {
	MenuData,
	MenuTemplate,
	MultiCanvasHandle,
} from "@/lib/menu/types";
import { FontSelector } from "./font-selector";
import { MenuCanvas } from "./menu-canvas";
import { TemplateSelector } from "./template-selector";

const DEFAULT_DATA: MenuData = {
	title: "Meu Cardápio",
	subtitle: "Sabores que encantam",
	sections: [
		{
			name: "Entradas",
			items: [
				{
					name: "Bruschetta",
					description: "Pão italiano com tomate e manjericão",
					price: "R$ 18,00",
				},
				{
					name: "Tábua de frios",
					description: "Queijos e embutidos selecionados",
					price: "R$ 35,00",
				},
			],
		},
		{
			name: "Pratos Principais",
			items: [
				{
					name: "Filé ao molho madeira",
					description: "Filé mignon com molho rústico e arroz",
					price: "R$ 62,00",
				},
				{
					name: "Salmão grelhado",
					description: "Com legumes ao vapor e batata",
					price: "R$ 58,00",
				},
				{
					name: "Risoto de cogumelos",
					description: "Arroz arbóreo com mix de cogumelos",
					price: "R$ 49,00",
				},
			],
		},
		{
			name: "Sobremesas",
			items: [
				{
					name: "Petit gateau",
					description: "Com sorvete de creme",
					price: "R$ 24,00",
				},
				{
					name: "Tiramisù",
					description: "Receita italiana tradicional",
					price: "R$ 22,00",
				},
			],
		},
	],
	style: {
		primaryColor: "#080872",
		backgroundColor: "#fdfcfc",
		showPrices: true,
		fontFamily: "--font-inter",
	},
};

type ActiveTab = "aparencia" | "itens";

export function MenuEditor() {
	const [data, setData] = useState<MenuData>(DEFAULT_DATA);
	const [template, setTemplate] = useState<MenuTemplate>(MENU_TEMPLATES[0]);
	const [isExporting, setIsExporting] = useState(false);
	const [activeTab, setActiveTab] = useState<ActiveTab>("aparencia");
	const canvasRef = useRef<MultiCanvasHandle>(null);

	const totalItems = data.sections.reduce((acc, s) => acc + s.items.length, 0);

	function updateData(patch: Partial<MenuData>) {
		setData((prev) => ({ ...prev, ...patch }));
	}

	function updateStyle(patch: Partial<MenuData["style"]>) {
		setData((prev) => ({ ...prev, style: { ...prev.style, ...patch } }));
	}

	function updateLogo(patch: Partial<NonNullable<MenuData["logo"]>>) {
		setData((prev) => {
			if (!prev.logo) return prev;
			return { ...prev, logo: { ...prev.logo, ...patch } };
		});
	}

	const logoInputRef = useRef<HTMLInputElement>(null);

	function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			updateData({
				logo: {
					dataUrl: reader.result as string,
					size: 50,
					position: "center",
				},
			});
		};
		reader.readAsDataURL(file);
		e.target.value = "";
	}

	function updateSectionName(si: number, name: string) {
		setData((prev) => ({
			...prev,
			sections: prev.sections.map((s, i) => (i === si ? { ...s, name } : s)),
		}));
	}

	function updateItem(
		si: number,
		ii: number,
		patch: Partial<MenuData["sections"][0]["items"][0]>,
	) {
		setData((prev) => ({
			...prev,
			sections: prev.sections.map((s, sIdx) => {
				if (sIdx !== si) return s;
				return {
					...s,
					items: s.items.map((item, iIdx) =>
						iIdx === ii ? { ...item, ...patch } : item,
					),
				};
			}),
		}));
	}

	function addSection() {
		setData((prev) => ({
			...prev,
			sections: [
				...prev.sections,
				{ name: "Nova Seção", items: [{ name: "" }] },
			],
		}));
	}

	function removeSection(si: number) {
		setData((prev) => ({
			...prev,
			sections: prev.sections.filter((_, i) => i !== si),
		}));
	}

	function addItem(si: number) {
		setData((prev) => ({
			...prev,
			sections: prev.sections.map((s, i) =>
				i === si ? { ...s, items: [...s.items, { name: "" }] } : s,
			),
		}));
	}

	function removeItem(si: number, ii: number) {
		setData((prev) => ({
			...prev,
			sections: prev.sections.map((s, sIdx) => {
				if (sIdx !== si) return s;
				return { ...s, items: s.items.filter((_, iIdx) => iIdx !== ii) };
			}),
		}));
	}

	function selectTemplate(id: string) {
		const found = MENU_TEMPLATES.find((t) => t.id === id);
		if (found) setTemplate(found);
	}

	async function handleExportPdf() {
		const dataUrls = canvasRef.current?.getDataURLs();
		if (!dataUrls?.length) return;
		setIsExporting(true);
		await exportMenuPdf(dataUrls);
		setIsExporting(false);
	}

	async function handleExportPng() {
		const dataUrls = canvasRef.current?.getDataURLs();
		if (!dataUrls?.length) return;
		setIsExporting(true);
		await exportMenuPng(dataUrls);
		setIsExporting(false);
	}

	const tabs = [
		{ id: "aparencia" as const, label: "Aparência" },
		{
			id: "itens" as const,
			label: `Itens${totalItems > 0 ? ` (${totalItems})` : ""}`,
		},
	];

	return (
		<div className="grid gap-6 lg:grid-cols-[3fr_4fr]">
			<div>
				<div className="flex border-b border-border mb-5">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none ${
								activeTab === tab.id
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{activeTab === "aparencia" && (
					<div className="space-y-5">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Template</Label>
							<TemplateSelector
								templates={MENU_TEMPLATES}
								selectedId={template.id}
								onSelect={selectTemplate}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="menu-title" className="text-sm font-medium">
								Título
							</Label>
							<Input
								id="menu-title"
								value={data.title}
								onChange={(e) => updateData({ title: e.target.value })}
								placeholder="Nome do estabelecimento"
								maxLength={80}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="menu-subtitle" className="text-sm font-medium">
								Subtítulo{" "}
								<span className="font-normal text-muted-foreground">
									(opcional)
								</span>
							</Label>
							<Input
								id="menu-subtitle"
								value={data.subtitle ?? ""}
								onChange={(e) =>
									updateData({ subtitle: e.target.value || undefined })
								}
								placeholder="Tagline ou tipo de culinária"
								maxLength={80}
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium">
								Logo{" "}
								<span className="font-normal text-muted-foreground">
									(opcional)
								</span>
							</Label>
							<input
								ref={logoInputRef}
								type="file"
								accept="image/png,image/jpeg,image/webp,image/svg+xml"
								onChange={handleLogoUpload}
								className="sr-only"
							/>
							{data.logo ? (
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<img
											src={data.logo.dataUrl}
											alt="Logo"
											className="h-10 w-auto rounded border border-border object-contain bg-muted"
										/>
										<button
											type="button"
											onClick={() => updateData({ logo: undefined })}
											className="text-sm text-muted-foreground hover:text-destructive"
										>
											Remover
										</button>
									</div>
									<div className="space-y-1.5">
										<Label className="text-sm font-medium">Tamanho</Label>
										<input
											type="range"
											min={20}
											max={100}
											value={data.logo.size}
											onChange={(e) =>
												updateLogo({ size: Number(e.target.value) })
											}
											className="w-full accent-primary"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-sm font-medium">Posição</Label>
										<div className="flex gap-1">
											{(["left", "center", "right"] as const).map((pos) => (
												<button
													key={pos}
													type="button"
													onClick={() => updateLogo({ position: pos })}
													className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
														data.logo?.position === pos
															? "border-primary bg-primary text-primary-foreground"
															: "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
													}`}
												>
													{pos === "left"
														? "Esquerda"
														: pos === "center"
															? "Centro"
															: "Direita"}
												</button>
											))}
										</div>
									</div>
								</div>
							) : (
								<Button
									type="button"
									variant="outline"
									onClick={() => logoInputRef.current?.click()}
									className="w-full"
								>
									Carregar logo
								</Button>
							)}
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium">Fonte</Label>
							<FontSelector
								value={data.style.fontFamily}
								onChange={(value) => updateStyle({ fontFamily: value })}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium">Cor principal</Label>
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={data.style.primaryColor}
										onChange={(e) =>
											updateStyle({ primaryColor: e.target.value })
										}
										className="h-9 w-12 cursor-pointer rounded-md border border-border bg-card p-1"
									/>
									<Input
										value={data.style.primaryColor}
										onChange={(e) =>
											updateStyle({ primaryColor: e.target.value })
										}
										maxLength={7}
										className="w-28 font-mono text-sm"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label className="text-sm font-medium">Cor de fundo</Label>
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={data.style.backgroundColor}
										onChange={(e) =>
											updateStyle({ backgroundColor: e.target.value })
										}
										className="h-9 w-12 cursor-pointer rounded-md border border-border bg-card p-1"
									/>
									<Input
										value={data.style.backgroundColor}
										onChange={(e) =>
											updateStyle({ backgroundColor: e.target.value })
										}
										maxLength={7}
										className="w-28 font-mono text-sm"
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id="show-prices"
								checked={data.style.showPrices}
								onCheckedChange={(checked) =>
									updateStyle({ showPrices: checked === true })
								}
							/>
							<label htmlFor="show-prices" className="cursor-pointer text-sm">
								Exibir preços
							</label>
						</div>
					</div>
				)}

				{activeTab === "itens" && (
					<div className="space-y-5">
						{data.sections.map((section, si) => (
							<div
								key={si}
								className="rounded-md border border-border p-3 space-y-3 bg-white"
							>
								<div className="flex items-center gap-2">
									<Input
										value={section.name}
										onChange={(e) => updateSectionName(si, e.target.value)}
										placeholder="Nome da seção"
										className="flex-1 font-medium"
									/>
									<AlertDialog>
										<AlertDialogTrigger
											render={
												<Button
													type="button"
													variant="ghost"
													size="sm"
													disabled={data.sections.length <= 1}
													className="shrink-0 text-muted-foreground hover:text-destructive"
												/>
											}
										>
											Remover
										</AlertDialogTrigger>
										<AlertDialogContent size="sm">
											<AlertDialogHeader>
												<AlertDialogTitle>Remover seção</AlertDialogTitle>
												<AlertDialogDescription>
													A seção &quot;{section.name}&quot; e todos os seus
													itens serão removidos. Essa ação não pode ser
													desfeita.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancelar</AlertDialogCancel>
												<AlertDialogAction
													variant="destructive"
													onClick={() => removeSection(si)}
												>
													Remover
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>

								<div className="space-y-3">
									{section.items.map((item, ii) => (
										<div
											key={ii}
											className="rounded-sm bg-muted p-2 space-y-1.5"
										>
											<div className="flex items-center gap-2">
												<Input
													value={item.name}
													onChange={(e) =>
														updateItem(si, ii, { name: e.target.value })
													}
													placeholder="Nome do item"
													className="flex-1 h-8 text-sm"
												/>
												{data.style.showPrices && (
													<Input
														value={item.price ?? ""}
														onChange={(e) =>
															updateItem(si, ii, { price: e.target.value })
														}
														placeholder="Preço"
														className="h-8 text-sm w-24"
													/>
												)}
												<button
													type="button"
													onClick={() => removeItem(si, ii)}
													disabled={section.items.length <= 1}
													className="text-sm text-muted-foreground hover:text-destructive disabled:opacity-30 px-1"
												>
													×
												</button>
											</div>
											<Input
												value={item.description ?? ""}
												onChange={(e) =>
													updateItem(si, ii, {
														description: e.target.value || undefined,
													})
												}
												placeholder="Descrição (opcional)"
												className="h-8 text-sm"
											/>
										</div>
									))}
								</div>

								<Button
									type="button"
									variant="link"
									onClick={() => addItem(si)}
									className="rounded-md py-1.5 text-sm font-medium hover:cursor-pointer hover:bg-primary/5"
								>
									<ListPlus /> Adicionar item
								</Button>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={addSection}
							className="w-full rounded-md border border-primary/40 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:text-primary hover:bg-primary/5"
						>
							<Form /> Adicionar seção
						</Button>
					</div>
				)}
			</div>

			<div className="space-y-4">
				<div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
					<MenuCanvas ref={canvasRef} data={data} template={template} />
				</div>
				<div className="flex gap-3">
					<Button
						onClick={handleExportPdf}
						disabled={isExporting}
						className="flex-1"
					>
						{isExporting ? "Gerando PDF…" : "Baixar PDF"}
					</Button>
					<Button
						onClick={handleExportPng}
						disabled={isExporting}
						variant="outline"
						className="flex-1"
					>
						Baixar PNG
					</Button>
				</div>
			</div>
		</div>
	);
}
