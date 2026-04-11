"use client";

import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Save } from "lucide-react";
import { Sheet } from "react-modal-sheet";
import {
  ScaledResume,
  A4_WIDTH,
  A4_HEIGHT,
} from "@/components/resume-templates/scaled-resume";
import { ResumeRenderer } from "@/components/resume-templates/renderer";
import {
  TEMPLATE_IDS,
  TEMPLATE_LABELS,
  ACCENT_COLORS,
  ACCENT_COLOR_LABELS,
  RESUME_FONT_OPTIONS,
  RESUME_FONT_SIZE_OPTIONS,
  type ResumeFontVar,
  type ResumeFontSize,
} from "@/components/resume-templates/config";
import type { TemplateId } from "@/components/resume-templates/config";
import type { ResumeTemplateData } from "@/components/resume-templates/types";
import { ResumePdfButton } from "@/components/resume-pdf-button";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import { cn } from "@/utils/css";

interface ResumePreviewModalProps {
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
  resumeId?: string;
  /** Show template/color/font controls in the mobile bottom sheet (default: false) */
  showTemplateControls?: boolean;
  hasPendingChanges?: boolean;
  onSave?: () => void;
}

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
  resumeId,
  showTemplateControls = false,
  hasPendingChanges = false,
  onSave,
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

  // Lock body scroll when desktop modal is open, preserving scroll position
  useEffect(() => {
    if (!open || !isWideEnough) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open, isWideEnough]);

  if (isWideEnough) {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col bg-[#e8eaed] focus:outline-none">
            <DialogPrimitive.Title className="sr-only">
              Pré-visualização do currículo
            </DialogPrimitive.Title>
            {/* Top bar — fixed, never scrolls */}
            <div className="shrink-0 bg-white border-b flex items-center justify-between px-6 py-3 shadow-sm">
              {resumeId && data ? (
                <ResumePdfButton
                  resumeId={resumeId}
                  templateId={templateId}
                  data={data}
                  color={color}
                  fontVar={fontVar}
                  fontSize={fontSize}
                  hasPendingChanges={hasPendingChanges}
                />
              ) : (
                <div />
              )}
              <DialogPrimitive.Close className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <X className="h-5 w-5" />
                <span className="sr-only">Fechar</span>
              </DialogPrimitive.Close>
            </div>

            {/* Scrollable area — only this scrolls */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[794px] mx-auto py-10">
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
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  // Mobile: bottom sheet
  return (
    <Sheet isOpen={open} onClose={() => onOpenChange(false)} snapPoints={[0.9]}>
      <Sheet.Backdrop onTap={() => onOpenChange(false)} />
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          {/* Template controls — only shown when showTemplateControls=true */}
          {showTemplateControls && (
            <div className="px-4 pb-3 border-b shrink-0 space-y-3.5">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
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
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Fonte
                  </label>
                  <NativeSelect
                    value={fontVar}
                    onChange={(e) =>
                      onFontVarChange?.(e.target.value as ResumeFontVar)
                    }
                    className="w-[180px]"
                    aria-label="Fonte do currículo"
                  >
                    {RESUME_FONT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Tamanho da fonte
                  </label>
                  <NativeSelect
                    value={fontSize}
                    onChange={(e) =>
                      onFontSizeChange?.(e.target.value as ResumeFontSize)
                    }
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

          {/* Preview — scrollable */}
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

          {/* Save footer — only shown when there are pending changes */}
          {hasPendingChanges && onSave && (
            <div className="px-4 py-3 border-t shrink-0">
              <p className="flex items-center gap-1.5 text-sm text-amber-600 italic mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                Alterações não salvas
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  onSave();
                  onOpenChange(false);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar alterações
              </Button>
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
