"use client";

import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ALIGN_CONTENT_OPTIONS,
	ALIGN_ITEMS_OPTIONS,
	ALIGN_SELF_OPTIONS,
	buildFullCSS,
	createDefaultItem,
	DEFAULT_CONTAINER,
	FLEX_DIRECTION_OPTIONS,
	FLEX_WRAP_OPTIONS,
	type FlexContainer,
	type FlexItem,
	JUSTIFY_CONTENT_OPTIONS,
} from "@/lib/css/flexbox";
import { cn } from "@/lib/utils";

export function FlexboxGenerator() {
	const [container, setContainer] = useState<FlexContainer>(DEFAULT_CONTAINER);
	const [items, setItems] = useState<FlexItem[]>([
		createDefaultItem(0),
		createDefaultItem(1),
		createDefaultItem(2),
		createDefaultItem(3),
	]);
	const [activeItemIndex, setActiveItemIndex] = useState(0);

	const activeItem = items[activeItemIndex];

	function updateContainer(updates: Partial<FlexContainer>) {
		setContainer((prev) => ({ ...prev, ...updates }));
	}

	function updateItem(index: number, updates: Partial<FlexItem>) {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, ...updates } : item)),
		);
	}

	function addItem() {
		if (items.length >= 8) return;
		setItems((prev) => [...prev, createDefaultItem(prev.length)]);
		setActiveItemIndex(items.length);
	}

	function removeItem(index: number) {
		if (items.length <= 1) return;
		setItems((prev) => prev.filter((_, i) => i !== index));
		if (activeItemIndex >= index && activeItemIndex > 0) {
			setActiveItemIndex((prev) => prev - 1);
		}
	}

	const containerStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: container.flexDirection,
		flexWrap: container.flexWrap,
		justifyContent: container.justifyContent,
		alignItems: container.alignItems,
		alignContent: container.alignContent,
		gap: container.gap,
		minHeight: "320px",
		padding: "16px",
		backgroundColor: "var(--muted)",
		borderRadius: "6px",
		border: "1px dashed var(--border)",
		transition: "all 0.2s ease",
	};

	const cssCode = buildFullCSS(container, items, ".container", ".item");

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-4">
						<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
							Container
						</h3>

						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Direção
							</span>
							<div className="grid grid-cols-2 gap-1">
								{FLEX_DIRECTION_OPTIONS.map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() =>
											updateContainer({ flexDirection: opt.value })
										}
										className={cn(
											"rounded-md px-2.5 py-1.5 text-caption font-medium transition-colors text-center",
											container.flexDirection === opt.value
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Quebra de linha
							</span>
							<div className="grid grid-cols-3 gap-1">
								{FLEX_WRAP_OPTIONS.map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() => updateContainer({ flexWrap: opt.value })}
										className={cn(
											"rounded-md px-2 py-1.5 text-caption font-medium transition-colors text-center",
											container.flexWrap === opt.value
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Justify content
							</span>
							<div className="grid grid-cols-2 gap-1">
								{JUSTIFY_CONTENT_OPTIONS.map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() =>
											updateContainer({ justifyContent: opt.value })
										}
										className={cn(
											"rounded-md px-2 py-1.5 text-caption font-medium transition-colors text-center",
											container.justifyContent === opt.value
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Align items
							</span>
							<div className="grid grid-cols-2 gap-1">
								{ALIGN_ITEMS_OPTIONS.map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() => updateContainer({ alignItems: opt.value })}
										className={cn(
											"rounded-md px-2 py-1.5 text-caption font-medium transition-colors text-center",
											container.alignItems === opt.value
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>

						{container.flexWrap !== "nowrap" && (
							<div className="space-y-1.5">
								<span className="text-xs font-medium text-foreground">
									Align content
								</span>
								<div className="grid grid-cols-2 gap-1">
									{ALIGN_CONTENT_OPTIONS.map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() =>
												updateContainer({ alignContent: opt.value })
											}
											className={cn(
												"rounded-md px-2 py-1.5 text-caption font-medium transition-colors text-center",
												container.alignContent === opt.value
													? "bg-accent text-accent-foreground"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						)}

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-foreground">Gap</span>
								<span className="font-mono text-caption text-muted-foreground">
									{container.gap}px
								</span>
							</div>
							<Slider
								min={0}
								max={48}
								step={1}
								value={[container.gap]}
								onValueChange={([v]) => updateContainer({ gap: v })}
							/>
						</div>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between px-4 py-3 border-b border-border">
						<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
							Preview
						</h3>
						<span className="font-mono text-caption text-muted-foreground">
							{items.length} itens
						</span>
					</div>
					<div className="flex-1 p-4">
						<div style={containerStyle}>
							{items.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveItemIndex(items.indexOf(item))}
									className={cn(
										"flex items-center justify-center rounded-md text-white font-mono text-sm font-semibold transition-all select-none border-0",
										activeItemIndex === items.indexOf(item)
											? "ring-2 ring-foreground ring-offset-2"
											: "hover:opacity-90",
									)}
									style={{
										backgroundColor: item.color,
										minWidth: "60px",
										minHeight: "60px",
										flexGrow: item.flexGrow,
										flexShrink: item.flexShrink,
										flexBasis:
											item.flexBasis === "auto" ? "auto" : `${item.flexBasis}`,
										alignSelf:
											item.alignSelf === "auto" ? undefined : item.alignSelf,
										order: item.order,
									}}
								>
									{item.label}
								</button>
							))}
						</div>
					</div>
					<div className="flex items-center gap-2 px-4 py-3 border-t border-border">
						<Button
							variant="outline"
							size="sm"
							onClick={addItem}
							disabled={items.length >= 8}
							className="h-7 text-xs"
						>
							<Plus className="h-3 w-3 mr-1" />
							Adicionar item
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => removeItem(activeItemIndex)}
							disabled={items.length <= 1}
							className="h-7 text-xs"
						>
							<Trash className="h-3 w-3 mr-1" />
							Remover item
						</Button>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-4">
						<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
							Itens
						</h3>
						<div className="space-y-1">
							{items.map((item, i) => (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveItemIndex(i)}
									className={cn(
										"flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
										activeItemIndex === i
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									<span
										className="h-3 w-3 rounded-sm shrink-0"
										style={{ backgroundColor: item.color }}
									/>
									Item {item.label}
								</button>
							))}
						</div>
					</div>

					{activeItem && (
						<div className="p-4 space-y-4">
							<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
								Propriedades do item {activeItem.label}
							</h3>

							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<span className="text-xs font-medium text-foreground">
										Flex grow
									</span>
									<span className="font-mono text-caption text-muted-foreground">
										{activeItem.flexGrow}
									</span>
								</div>
								<Slider
									min={0}
									max={5}
									step={1}
									value={[activeItem.flexGrow]}
									onValueChange={([v]) =>
										updateItem(activeItemIndex, { flexGrow: v })
									}
								/>
							</div>

							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<span className="text-xs font-medium text-foreground">
										Flex shrink
									</span>
									<span className="font-mono text-caption text-muted-foreground">
										{activeItem.flexShrink}
									</span>
								</div>
								<Slider
									min={0}
									max={5}
									step={1}
									value={[activeItem.flexShrink]}
									onValueChange={([v]) =>
										updateItem(activeItemIndex, { flexShrink: v })
									}
								/>
							</div>

							<div className="space-y-1.5">
								<span className="text-xs font-medium text-foreground">
									Flex basis
								</span>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() =>
											updateItem(activeItemIndex, { flexBasis: "auto" })
										}
										className={cn(
											"flex-1 rounded-md px-2 py-1.5 text-caption font-medium transition-colors",
											activeItem.flexBasis === "auto"
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground border border-border",
										)}
									>
										auto
									</button>
									<Input
										type="text"
										value={
											activeItem.flexBasis === "auto"
												? ""
												: activeItem.flexBasis
										}
										onChange={(e) =>
											updateItem(activeItemIndex, {
												flexBasis: e.target.value || "auto",
											})
										}
										placeholder="ex: 100px, 20%"
										className="h-7 text-xs font-mono flex-1"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<span className="text-xs font-medium text-foreground">
									Align self
								</span>
								<div className="grid grid-cols-2 gap-1">
									{ALIGN_SELF_OPTIONS.map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() =>
												updateItem(activeItemIndex, { alignSelf: opt.value })
											}
											className={cn(
												"rounded-md px-2 py-1.5 text-caption font-medium transition-colors text-center",
												activeItem.alignSelf === opt.value
													? "bg-accent text-accent-foreground"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<span className="text-xs font-medium text-foreground">
										Order
									</span>
									<span className="font-mono text-caption text-muted-foreground">
										{activeItem.order}
									</span>
								</div>
								<Slider
									min={-5}
									max={5}
									step={1}
									value={[activeItem.order]}
									onValueChange={([v]) =>
										updateItem(activeItemIndex, { order: v })
									}
								/>
							</div>
						</div>
					)}

					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
								CSS
							</h3>
							<CopyButton text={cssCode} />
						</div>
						<pre className="font-mono text-caption leading-relaxed bg-muted p-3 rounded-md border border-border overflow-x-auto">
							{cssCode}
						</pre>
					</div>
				</div>
			}
		/>
	);
}
