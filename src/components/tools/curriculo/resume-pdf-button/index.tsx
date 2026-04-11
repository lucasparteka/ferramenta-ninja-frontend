"use client"

import { useState } from "react"
import { Download, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TemplateId, ResumeFontVar, ResumeFontSize } from "@/components/tools/curriculo/resume-templates/config"
import { RESUME_FONT_SIZE_OPTIONS, RESUME_FONT_DEFAULT } from "@/components/tools/curriculo/resume-templates/config"
import type { ResumeTemplateData } from "@/components/tools/curriculo/resume-templates/types"
import type { ResumeFormValues } from "@/components/tools/curriculo/resume-builder/types"

type ResumePdfButtonProps = {
  templateId: TemplateId
  data: ResumeTemplateData
  color: string
  fontVar?: ResumeFontVar
  fontSize?: ResumeFontSize
  formData: ResumeFormValues
  photoFile?: File | null
  label?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  className?: string
  hasPendingChanges?: boolean
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ResumePdfButton({
  templateId,
  data,
  color,
  fontVar,
  fontSize,
  formData,
  photoFile,
  label = "Baixar PDF",
  variant = "outline",
  size = "default",
  className,
  hasPendingChanges = false,
}: ResumePdfButtonProps) {
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function download() {
    setConfirming(false)
    setLoading(true)
    try {
      const zoom = RESUME_FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.zoom ?? 1.0
      const photoDataUrl = photoFile ? await fileToBase64(photoFile) : undefined

      const res = await fetch("/api/curriculo/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          layout: {
            templateId,
            color,
            fontVar: fontVar ?? RESUME_FONT_DEFAULT,
            fontSize: fontSize ?? "medium",
            zoom,
          },
          photoDataUrl,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Falha ao gerar PDF")
      }

      const blob = await res.blob()
      const filename = data.name
        ? `curriculo-${data.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
        : "curriculo.pdf"

      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      console.error("[PDF] download failed:", err)
    } finally {
      setLoading(false)
    }
  }

  function handleClick() {
    if (hasPendingChanges) {
      setConfirming(true)
    } else {
      download()
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
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

      {confirming && (
        <div className="flex gap-3 rounded-md border bg-background p-3 shadow-md w-80">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-semibold leading-none">Alterações pendentes</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você tem alterações não salvas. O PDF será gerado com os dados atuais do formulário.
            </p>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfirming(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="flex-1" onClick={download}>
                Baixar assim mesmo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
