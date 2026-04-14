"use client";

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
import { NativeSelect } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";

type TemplateSelectorProps = {
	templateId: TemplateId;
	color: string;
	fontVar: ResumeFontVar;
	fontSize: ResumeFontSize;
	onTemplateChange: (id: TemplateId) => void;
	onColorChange: (color: string) => void;
	onFontVarChange: (fontVar: ResumeFontVar) => void;
	onFontSizeChange: (size: ResumeFontSize) => void;
};

export function TemplateSelector({
	templateId,
	color,
	fontVar,
	fontSize,
	onTemplateChange,
	onColorChange,
	onFontVarChange,
	onFontSizeChange,
}: TemplateSelectorProps) {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
				<div className="flex flex-wrap gap-1.5">
					{TEMPLATE_IDS.map((id) => (
						<button
							key={id}
							type="button"
							onClick={() => onTemplateChange(id)}
							className={cn(
								"text-xs px-3 py-1.5 rounded-full font-medium border transition-colors",
								templateId === id
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-muted-foreground border-border hover:border-primary/50",
							)}
						>
							{TEMPLATE_LABELS[id]}
						</button>
					))}
				</div>
			</div>
			<div className="flex items-center gap-1.5">
				{ACCENT_COLORS.map((c) => (
					<button
						key={c}
						type="button"
						title={ACCENT_COLOR_LABELS[c]}
						onClick={() => onColorChange(c)}
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
				<div className="flex flex-col gap-1 w-full flex-1">
					<label className="text-xs font-medium text-muted-foreground">
						Fonte
					</label>
					<NativeSelect
						value={fontVar}
						onChange={(e) => onFontVarChange(e.target.value as ResumeFontVar)}
						className="w-full"
						aria-label="Fonte do currículo"
					>
						{RESUME_FONT_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</NativeSelect>
				</div>
				<div className="flex flex-col gap-1 w-full flex-1">
					<label className="text-xs font-medium text-muted-foreground">
						Tamanho da fonte
					</label>
					<NativeSelect
						value={fontSize}
						onChange={(e) => onFontSizeChange(e.target.value as ResumeFontSize)}
						className="w-full"
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
	);
}
