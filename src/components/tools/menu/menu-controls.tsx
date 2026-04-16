/** biome-ignore-all lint/suspicious/noArrayIndexKey: itens fixos */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MENU_TEMPLATES } from "@/lib/menu/templates";
import type { MenuData, MenuTemplate } from "@/lib/menu/types";
import { FontSelector } from "./font-selector";
import { TemplateSelector } from "./template-selector";

type MenuControlsProps = {
	data: MenuData;
	template: MenuTemplate;
	isExporting: boolean;
	onUpdateData: (patch: Partial<MenuData>) => void;
	onUpdateStyle: (patch: Partial<MenuData["style"]>) => void;
	onUpdateSectionName: (sectionIndex: number, name: string) => void;
	onUpdateItem: (
		sectionIndex: number,
		itemIndex: number,
		patch: Partial<MenuData["sections"][0]["items"][0]>,
	) => void;
	onAddSection: () => void;
	onRemoveSection: (sectionIndex: number) => void;
	onAddItem: (sectionIndex: number) => void;
	onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
	onSelectTemplate: (id: string) => void;
	onExportPdf: () => void;
	onExportPng: () => void;
};

export function MenuControls({
	data,
	template,
	isExporting,
	onUpdateData,
	onUpdateStyle,
	onUpdateSectionName,
	onUpdateItem,
	onAddSection,
	onRemoveSection,
	onAddItem,
	onRemoveItem,
	onSelectTemplate,
	onExportPdf,
	onExportPng,
}: MenuControlsProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					Template
				</h2>
				<TemplateSelector
					templates={MENU_TEMPLATES}
					selectedId={template.id}
					onSelect={onSelectTemplate}
				/>
			</div>

			<div className="space-y-3">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					Cabeçalho
				</h2>
				<div className="space-y-2">
					<Label htmlFor="menu-title">Título</Label>
					<Input
						id="menu-title"
						value={data.title}
						onChange={(e) => onUpdateData({ title: e.target.value })}
						placeholder="Nome do estabelecimento"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="menu-subtitle">Subtítulo (opcional)</Label>
					<Input
						id="menu-subtitle"
						value={data.subtitle ?? ""}
						onChange={(e) =>
							onUpdateData({ subtitle: e.target.value || undefined })
						}
						placeholder="Tagline ou tipo de culinária"
					/>
				</div>
			</div>

			<div className="space-y-3">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					Seções e Itens
				</h2>
				{data.sections.map((section, si) => (
					<div
						key={si}
						className="rounded-md border border-border p-3 space-y-3"
					>
						<div className="flex items-center gap-2">
							<Input
								value={section.name}
								onChange={(e) => onUpdateSectionName(si, e.target.value)}
								placeholder="Nome da seção"
								className="flex-1"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onRemoveSection(si)}
								disabled={data.sections.length <= 1}
								className="shrink-0 text-muted-foreground hover:text-destructive"
							>
								Remover
							</Button>
						</div>

						{section.items.map((item, ii) => (
							<div key={ii} className="rounded-sm bg-muted/40 p-2 space-y-2">
								<div className="flex items-center gap-2">
									<Input
										value={item.name}
										onChange={(e) =>
											onUpdateItem(si, ii, { name: e.target.value })
										}
										placeholder="Nome do item"
										className="flex-1 h-8 text-sm"
									/>
									{data.style.showPrices && (
										<Input
											value={item.price ?? ""}
											onChange={(e) =>
												onUpdateItem(si, ii, {
													price: e.target.value || undefined,
												})
											}
											placeholder="R$ 0,00"
											className="w-24 h-8 text-sm"
										/>
									)}
									<button
										type="button"
										onClick={() => onRemoveItem(si, ii)}
										disabled={section.items.length <= 1}
										className="text-xs text-muted-foreground hover:text-destructive disabled:opacity-30"
									>
										×
									</button>
								</div>
								<Input
									value={item.description ?? ""}
									onChange={(e) =>
										onUpdateItem(si, ii, {
											description: e.target.value || undefined,
										})
									}
									placeholder="Descrição (opcional)"
									className="h-8 text-sm"
								/>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onAddItem(si)}
							className="w-full"
						>
							+ Adicionar item
						</Button>
					</div>
				))}

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onAddSection}
					className="w-full"
				>
					+ Adicionar seção
				</Button>
			</div>

			<div className="space-y-3">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					Estilo
				</h2>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label htmlFor="primary-color">Cor principal</Label>
						<div className="flex items-center gap-2">
							<input
								id="primary-color"
								type="color"
								value={data.style.primaryColor}
								onChange={(e) =>
									onUpdateStyle({ primaryColor: e.target.value })
								}
								className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
							/>
							<span className="text-sm text-muted-foreground font-mono">
								{data.style.primaryColor}
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="bg-color">Cor de fundo</Label>
						<div className="flex items-center gap-2">
							<input
								id="bg-color"
								type="color"
								value={data.style.backgroundColor}
								onChange={(e) =>
									onUpdateStyle({ backgroundColor: e.target.value })
								}
								className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
							/>
							<span className="text-sm text-muted-foreground font-mono">
								{data.style.backgroundColor}
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="font-selector">Fonte</Label>
					<FontSelector
						value={data.style.fontFamily}
						onChange={(value) => onUpdateStyle({ fontFamily: value })}
					/>
				</div>

				<div className="flex items-center gap-3">
					<input
						id="show-prices"
						type="checkbox"
						checked={data.style.showPrices}
						onChange={(e) => onUpdateStyle({ showPrices: e.target.checked })}
						className="h-4 w-4 rounded border-border accent-primary"
					/>
					<Label htmlFor="show-prices">Exibir preços</Label>
				</div>
			</div>

			<div className="space-y-2">
				<Button
					type="button"
					onClick={onExportPdf}
					disabled={isExporting}
					className="w-full"
				>
					{isExporting ? "Gerando PDF…" : "Baixar PDF"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onExportPng}
					disabled={isExporting}
					className="w-full"
				>
					Baixar PNG
				</Button>
			</div>
		</div>
	);
}
