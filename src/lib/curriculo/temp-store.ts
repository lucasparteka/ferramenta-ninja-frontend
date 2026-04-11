import type { ResumeFormValues } from "@/components/tools/curriculo/resume-builder/types"
import type { TemplateId, ResumeFontVar, ResumeFontSize } from "@/components/tools/curriculo/resume-templates/config"

export type RenderPayload = {
  formData: ResumeFormValues
  layout: {
    templateId: TemplateId
    color: string
    fontVar: ResumeFontVar
    fontSize: ResumeFontSize
  }
  photoDataUrl?: string
}

type Entry = {
  data: RenderPayload
  expiresAt: number
}

const TTL_MS = 2 * 60 * 1000

const store = new Map<string, Entry>()

export function setTempData(token: string, data: RenderPayload): void {
  store.set(token, { data, expiresAt: Date.now() + TTL_MS })
}

export function getTempData(token: string): RenderPayload | null {
  const entry = store.get(token)
  if (!entry) return null
  store.delete(token)
  if (Date.now() > entry.expiresAt) return null
  return entry.data
}
