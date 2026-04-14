"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ResumeFormValues } from "@/components/tools/curriculo/resume-builder/types";
import { ResumePdfButton } from "@/components/tools/curriculo/resume-pdf-button";
import {
	ACCENT_COLOR_LABELS,
	ACCENT_COLORS,
	RESUME_FONT_OPTIONS,
	RESUME_FONT_SIZE_OPTIONS,
	type ResumeFontSize,
	type ResumeFontVar,
	TEMPLATE_IDS,
	TEMPLATE_LABELS,
	type TemplateId,
} from "@/components/tools/curriculo/resume-templates/config";
import { ResumeRenderer } from "@/components/tools/curriculo/resume-templates/renderer";
import {
	A4_HEIGHT,
	A4_WIDTH,
	ScaledResume,
} from "@/components/tools/curriculo/resume-templates/scaled-resume";
import type { ResumeTemplateData } from "@/components/tools/curriculo/resume-templates/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { NativeSelect } from "@/components/ui/select-native";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type ResumePreviewModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	data: ResumeTemplateData | null;
	templateId: TemplateId;
	color: string;
	fontVar: ResumeFontVar;
	fontSize: ResumeFontSize;
	onTemplateChange?: (id: TemplateId) => void;
	onColorChange?: (color: string) => void;
	onFontVarChange?: (fontVar: ResumeFontVar) => void;
	onFontSizeChange?: (size: ResumeFontSize) => void;
	showTemplateControls?: boolean;
	hasPendingChanges?: boolean;
	formData?: ResumeFormValues;
	photoFile?: File | null;
};

export function ResumePreviewModal({
	open,
	onOpenChange,
	data,
	templateId,
	color,
	fontVar,
	fontSize,
	onTemplateChange,
	onColorChange,
	onFontVarChange,
	onFontSizeChange,
	showTemplateControls = false,
	hasPendingChanges = false,
	formData,
	photoFile,
}: ResumePreviewModalProps) {
	const [isWideEnough, setIsWideEnough] = useState(false);

	useEffect(() => {
		const check = () => setIsWideEnough(window.innerWidth >= A4_WIDTH);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const fontZoom =
		RESUME_FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.zoom ?? 1.0;

	if (isWideEnough) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-none sm:max-w-none w-screen h-screen p-0 flex flex-col bg-[#e8eaed] rounded-none [&>button]:hidden">
					<DialogTitle className="sr-only">
						Pré-visualização do currículo
					</DialogTitle>
					<div className="shrink-0 bg-white border-b flex items-center justify-between px-6 py-3 shadow-sm">
						{data && formData ? (
							<ResumePdfButton
								templateId={templateId}
								data={data}
								color={color}
								fontVar={fontVar}
								fontSize={fontSize}
								hasPendingChanges={hasPendingChanges}
								formData={formData}
								photoFile={photoFile}
							/>
						) : (
							<div />
						)}
						<button
							onClick={() => onOpenChange(false)}
							className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
						>
							<X className="h-5 w-5" />
							<span className="sr-only">Fechar</span>
						</button>
					</div>

					<div className="flex-1 overflow-y-auto">
						<div className="max-w-198.5 mx-auto py-10">
							{data ? (
								<div
									className="bg-white shadow-xl ring-1 ring-black/8"
									style={{ minHeight: A4_HEIGHT }}
								>
									<ResumeRenderer
										templateId={templateId}
										data={data}
										color={color}
										fontVar={fontVar}
										fontZoom={fontZoom}
									/>
								</div>
							) : (
								<div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
									Nenhum dado disponível para pré-visualização.
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				showCloseButton={false}
				className="data-[side=bottom]:h-[90vh] flex flex-col p-0 rounded-t-2xl"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Pré-visualização do currículo</SheetTitle>
				</SheetHeader>
				<div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
					<span className="text-sm font-semibold">Pré-visualização</span>
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
						aria-label="Fechar"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				{showTemplateControls && (
					<div className="px-4 pb-3 border-b shrink-0 space-y-3.5">
						<div
							className="flex gap-1.5 overflow-x-auto pb-2"
							style={{ scrollbarWidth: "none" }}
						>
							{TEMPLATE_IDS.map((id) => (
								<button
									key={id}
									onClick={() => onTemplateChange?.(id)}
									className={cn(
										"text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap shrink-0",
										templateId === id
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground hover:bg-muted/80",
									)}
								>
									{TEMPLATE_LABELS[id]}
								</button>
							))}
						</div>

						<div className="flex items-center gap-2">
							{ACCENT_COLORS.map((c) => (
								<button
									key={c}
									type="button"
									title={ACCENT_COLOR_LABELS[c]}
									onClick={() => onColorChange?.(c)}
									className={cn(
										"w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
										color === c
											? "border-foreground scale-110"
											: "border-transparent",
									)}
									style={{ backgroundColor: c }}
								/>
							))}
						</div>
						<div className="flex gap-3">
							<div className="flex flex-col gap-1 flex-1">
								<label className="text-xs font-medium text-muted-foreground">
									Fonte
								</label>
								<NativeSelect
									value={fontVar}
									onChange={(e) =>
										onFontVarChange?.(e.target.value as ResumeFontVar)
									}
									className="lg:w-45 w-full"
									aria-label="Fonte do currículo"
								>
									{RESUME_FONT_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</NativeSelect>
							</div>
							<div className="flex flex-col gap-1 flex-1">
								<label className="text-xs font-medium text-muted-foreground">
									Tamanho da fonte
								</label>
								<NativeSelect
									value={fontSize}
									onChange={(e) =>
										onFontSizeChange?.(e.target.value as ResumeFontSize)
									}
									className="lg:w-45 w-full"
									aria-label="Tamanho da fonte"
								>
									{RESUME_FONT_SIZE_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</NativeSelect>
							</div>
						</div>
					</div>
				)}
				<div className="overflow-y-auto flex-1 bg-[#f0f2f5] p-4">
					{data ? (
						<ScaledResume
							templateId={templateId}
							data={data}
							color={color}
							fontVar={fontVar}
							fontZoom={fontZoom}
							className="shadow-lg ring-1 ring-black/10"
						/>
					) : (
						<div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
							Nenhum dado disponível para pré-visualização.
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
