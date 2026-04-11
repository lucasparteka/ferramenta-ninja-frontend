"use client";

import { useState } from "react";
import { Download, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { pb } from "@/services/pocketbase";
import type { TemplateId, ResumeFontVar, ResumeFontSize } from "@/components/resume-templates/config";
import { RESUME_FONT_SIZE_OPTIONS as FONT_SIZE_OPTS, RESUME_FONT_DEFAULT } from "@/components/resume-templates/config";
import type { ResumeTemplateData } from "@/components/resume-templates/types";

interface ResumePdfButtonProps {
  resumeId: string;
  templateId: TemplateId;
  /** Only used for the filename derived from candidate name */
  data: ResumeTemplateData;
  color: string;
  fontVar?: ResumeFontVar;
  fontSize?: ResumeFontSize;
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  hasPendingChanges?: boolean;
}

export function ResumePdfButton({
  resumeId,
  templateId,
  data,
  color,
  fontVar,
  fontSize,
  label = "Baixar PDF",
  variant = "outline",
  size = "default",
  className,
  hasPendingChanges = false,
}: ResumePdfButtonProps) {
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  async function download() {
    setPopoverOpen(false);
    setLoading(true);
    try {
      const zoom = FONT_SIZE_OPTS.find((o) => o.value === fontSize)?.zoom ?? 1.0;
      const url =
        `/api/resumes/${resumeId}/pdf` +
        `?template=${templateId}` +
        `&color=${encodeURIComponent(color)}` +
        `&font=${encodeURIComponent(fontVar ?? RESUME_FONT_DEFAULT)}` +
        `&zoom=${zoom}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${pb.authStore.token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "PDF generation failed");
      }

      const blob = await res.blob();
      const filename = data.name
        ? `curriculo-${data.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
        : "curriculo.pdf";

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("[PDF] download failed:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (hasPendingChanges) {
      setPopoverOpen(true);
    } else {
      download();
    }
  }

  const trigger = (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {loading ? "Gerando PDF..." : label}
    </Button>
  );

  if (!hasPendingChanges) return trigger;

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-semibold leading-none">Alterações pendentes</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você tem alterações não salvas. O PDF será gerado com o conteúdo da última versão salva do seu currículo. Salve para baixar o PDF atualizado.
            </p>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setPopoverOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="flex-1" onClick={download}>
                Baixar assim mesmo
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
