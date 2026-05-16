"use client";

import { Link, Plus, RotateCcw, Trash, Unlink } from "lucide-react";
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

const FLEX_BASIS_PRESETS = ["auto", "0", "100px", "200px", "50%"] as const;
const SIZE_PRESETS = ["auto", "60px", "100px", "150px", "50%"] as const;

function isFlexBasisPreset(value: string): boolean {
	return (FLEX_BASIS_PRESETS as readonly string[]).includes(value);
}

function isSizePreset(value: string): boolean {
	return (SIZE_PRESETS as readonly string[]).includes(value);
}

export function FlexboxGenerator() {
	const [container, setContainer] = useState<FlexContainer>(DEFAULT_CONTAINER);
	const [items, setItems] = useState<FlexItem[]>([
		createDefaultItem(0),
		createDefaultItem(1),
		createDefaultItem(2),
		createDefaultItem(3),
	]);
	const [activeItemIndex, setActiveItemIndex] = useState(0);
	const [gapLinked, setGapLinked] = useState(true);

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
		setItems((prev) => {
			const next = [...prev, createDefaultItem(prev.length)];
			setActiveItemIndex(next.length - 1);
			return next;
		});
	}

	function removeItem(index: number) {
		if (items.length <= 1) return;
		setItems((prev) => prev.filter((_, i) => i !== index));
		if (activeItemIndex >= index && activeItemIndex > 0) {
			setActiveItemIndex((prev) => prev - 1);
		}
	}

	function resetAll() {
		setContainer(DEFAULT_CONTAINER);
		setItems([
			createDefaultItem(0),
			createDefaultItem(1),
			createDefaultItem(2),
			createDefaultItem(3),
		]);
		setActiveItemIndex(0);
		setGapLinked(true);
	}

	const containerStyle: React.CSSProperties = {
		display: container.display,
		flexDirection: container.flexDirection,
		flexWrap: container.flexWrap,
		justifyContent: container.justifyContent,
		alignItems: container.alignItems,
		alignContent: container.alignContent,
		rowGap: `${container.rowGap}px`,
		columnGap: `${container.columnGap}px`,
		minHeight: `${container.minHeight}px`,
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
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Container
						</h3>

						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Display
							</span>
							<div className="grid grid-cols-2 gap-1">
								{(["flex", "inline-flex"] as const).map((d) => (
									<button
										key={d}
										type="button"
										onClick={() => updateContainer({ display: d })}
										className={cn(
											"rounded-md px-2.5 py-1.5 text-[11px] font-mono font-medium transition-colors text-center",
											container.display === d
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										{d}
									</button>
								))}
							</div>
						</div>

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
											"rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors text-center",
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
											"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
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
											"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
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
											"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
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
												"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
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

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-foreground">Gap</span>
								<button
									type="button"
									onClick={() => {
										if (!gapLinked) {
											updateContainer({ columnGap: container.rowGap });
										}
										setGapLinked((v) => !v);
									}}
									className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
									title={gapLinked ? "Separar row/column" : "Vincular row/column"}
								>
									{gapLinked ? (
										<Link className="h-3 w-3" />
									) : (
										<Unlink className="h-3 w-3" />
									)}
									{gapLinked ? "vinculado" : "separado"}
								</button>
							</div>
							{gapLinked ? (
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-[11px] text-muted-foreground">
											row + column
										</span>
										<span className="font-mono text-[11px] text-muted-foreground">
											{container.rowGap}px
										</span>
									</div>
									<Slider
										min={0}
										max={64}
										step={1}
										value={[container.rowGap]}
										onValueChange={([v]) =>
											updateContainer({ rowGap: v, columnGap: v })
										}
									/>
								</div>
							) : (
								<div className="space-y-2">
									<div className="space-y-1">
										<div className="flex justify-between">
											<span className="text-[11px] text-muted-foreground">
												row-gap
											</span>
											<span className="font-mono text-[11px] text-muted-foreground">
												{container.rowGap}px
											</span>
										</div>
										<Slider
											min={0}
											max={64}
											step={1}
											value={[container.rowGap]}
											onValueChange={([v]) => updateContainer({ rowGap: v })}
										/>
									</div>
									<div className="space-y-1">
										<div className="flex justify-between">
											<span className="text-[11px] text-muted-foreground">
												column-gap
											</span>
											<span className="font-mono text-[11px] text-muted-foreground">
												{container.columnGap}px
											</span>
										</div>
										<Slider
											min={0}
											max={64}
											step={1}
											value={[container.columnGap]}
											onValueChange={([v]) => updateContainer({ columnGap: v })}
										/>
									</div>
								</div>
							)}
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-foreground">
									Altura mínima
								</span>
								<span className="font-mono text-[11px] text-muted-foreground">
									{container.minHeight}px
								</span>
							</div>
							<Slider
								min={100}
								max={800}
								step={10}
								value={[container.minHeight]}
								onValueChange={([v]) => updateContainer({ minHeight: v })}
							/>
						</div>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between px-4 py-3 border-b border-border">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Preview
						</h3>
						<span className="font-mono text-[11px] text-muted-foreground">
							{items.length} itens
						</span>
					</div>
					<div className="flex-1 p-4">
						<div style={containerStyle}>
							{items.map((item, i) => (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveItemIndex(i)}
									className={cn(
										"relative flex items-center justify-center rounded-md text-white font-mono text-sm font-semibold transition-all select-none border-0",
										activeItemIndex === i
											? "ring-2 ring-foreground ring-offset-2"
											: "hover:opacity-90",
									)}
									style={{
										backgroundColor: item.color,
										minWidth: "60px",
										minHeight: "60px",
										flexGrow: item.flexGrow,
										flexShrink: item.flexShrink,
										flexBasis: item.flexBasis,
										alignSelf:
											item.alignSelf === "auto" ? undefined : item.alignSelf,
										order: item.order,
										width: item.width !== "auto" ? item.width : undefined,
										height: item.height !== "auto" ? item.height : undefined,
									}}
								>
									{item.label}
									{item.order !== 0 && (
										<span className="absolute top-1 right-1 bg-black/40 text-white text-[9px] font-mono leading-none px-1 py-0.5 rounded">
											{item.order > 0 ? `+${item.order}` : item.order}
										</span>
									)}
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
						<Button
							variant="ghost"
							size="sm"
							onClick={resetAll}
							className="h-7 text-xs ml-auto text-muted-foreground hover:text-foreground"
						>
							<RotateCcw className="h-3 w-3 mr-1" />
							Resetar
						</Button>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-4">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Propriedades do item {activeItem.label}
							</h3>

							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<span className="text-xs font-medium text-foreground">
										Flex grow
									</span>
									<span className="font-mono text-[11px] text-muted-foreground">
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
									<span className="font-mono text-[11px] text-muted-foreground">
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
								<div className="grid grid-cols-3 gap-1">
									{FLEX_BASIS_PRESETS.map((preset) => (
										<button
											key={preset}
											type="button"
											onClick={() =>
												updateItem(activeItemIndex, { flexBasis: preset })
											}
											className={cn(
												"rounded-md px-2 py-1.5 text-[11px] font-mono font-medium transition-colors text-center",
												activeItem.flexBasis === preset
													? "bg-accent text-accent-foreground"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
										>
											{preset}
										</button>
									))}
									<button
										type="button"
										onClick={() => {
											if (isFlexBasisPreset(activeItem.flexBasis)) {
												updateItem(activeItemIndex, { flexBasis: "" });
											}
										}}
										className={cn(
											"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
											!isFlexBasisPreset(activeItem.flexBasis)
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										custom
									</button>
								</div>
								{!isFlexBasisPreset(activeItem.flexBasis) && (
									<Input
										type="text"
										value={activeItem.flexBasis}
										onChange={(e) =>
											updateItem(activeItemIndex, {
												flexBasis: e.target.value,
											})
										}
										placeholder="ex: 150px, 30%"
										className="h-7 text-xs font-mono"
										autoFocus
									/>
								)}
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
												"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
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
									<span className="font-mono text-[11px] text-muted-foreground">
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

							<div className="space-y-1.5">
								<span className="text-xs font-medium text-foreground">
									Width
								</span>
								<div className="grid grid-cols-3 gap-1">
									{SIZE_PRESETS.map((preset) => (
										<button
											key={preset}
											type="button"
											onClick={() =>
												updateItem(activeItemIndex, { width: preset })
											}
											className={cn(
												"rounded-md px-2 py-1.5 text-[11px] font-mono font-medium transition-colors text-center",
												activeItem.width === preset
													? "bg-accent text-accent-foreground"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
										>
											{preset}
										</button>
									))}
									<button
										type="button"
										onClick={() => {
											if (isSizePreset(activeItem.width)) {
												updateItem(activeItemIndex, { width: "" });
											}
										}}
										className={cn(
											"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
											!isSizePreset(activeItem.width)
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										custom
									</button>
								</div>
								{!isSizePreset(activeItem.width) && (
									<Input
										type="text"
										value={activeItem.width}
										onChange={(e) =>
											updateItem(activeItemIndex, { width: e.target.value })
										}
										placeholder="ex: 120px, 33%"
										className="h-7 text-xs font-mono"
									/>
								)}
							</div>

							<div className="space-y-1.5">
								<span className="text-xs font-medium text-foreground">
									Height
								</span>
								<div className="grid grid-cols-3 gap-1">
									{SIZE_PRESETS.map((preset) => (
										<button
											key={preset}
											type="button"
											onClick={() =>
												updateItem(activeItemIndex, { height: preset })
											}
											className={cn(
												"rounded-md px-2 py-1.5 text-[11px] font-mono font-medium transition-colors text-center",
												activeItem.height === preset
													? "bg-accent text-accent-foreground"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
										>
											{preset}
										</button>
									))}
									<button
										type="button"
										onClick={() => {
											if (isSizePreset(activeItem.height)) {
												updateItem(activeItemIndex, { height: "" });
											}
										}}
										className={cn(
											"rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-center",
											!isSizePreset(activeItem.height)
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									>
										custom
									</button>
								</div>
								{!isSizePreset(activeItem.height) && (
									<Input
										type="text"
										value={activeItem.height}
										onChange={(e) =>
											updateItem(activeItemIndex, { height: e.target.value })
										}
										placeholder="ex: 80px, 20%"
										className="h-7 text-xs font-mono"
									/>
								)}
							</div>
						</div>
					)}

					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								CSS
							</h3>
							<CopyButton text={cssCode} />
						</div>
						<pre className="font-mono text-[11px] leading-relaxed bg-muted p-3 rounded-md border border-border overflow-x-auto">
							{cssCode}
						</pre>
					</div>
				</div>
			}
		/>
	);
}
