import { notFound } from "next/navigation"
import { getTempData } from "@/lib/curriculo/temp-store"
import { ResumeRenderer } from "@/components/tools/curriculo/resume-templates/renderer"
import { RESUME_FONT_SIZE_OPTIONS } from "@/components/tools/curriculo/resume-templates/config"
import type { ResumeTemplateData } from "@/components/tools/curriculo/resume-templates/types"
import type { ResumeFormValues } from "@/components/tools/curriculo/resume-builder/types"

export const dynamic = "force-dynamic"

function toTemplateData(values: ResumeFormValues, photoUrl: string | null): ResumeTemplateData {
  return {
    name: values.name,
    headline: values.headline,
    email: values.email,
    phone: values.phone,
    location: values.location || undefined,
    summary: values.summary || undefined,
    photoUrl,
    socialLinks: values.socialLinks?.map((l) => ({ platform: l.platform, url: l.url })) ?? [],
    experiences: values.experiences?.map((e) => ({
      role: e.role,
      company: e.company,
      location: e.location || undefined,
      startDate: e.startDate,
      endDate: e.endDate || undefined,
      isCurrent: e.isCurrent,
      description: e.description || undefined,
    })) ?? [],
    education: values.education?.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field || undefined,
      startYear: e.startYear,
      endYear: e.endYear || undefined,
      isCurrent: e.isCurrent,
      description: e.description || undefined,
    })) ?? [],
    skills: values.skills?.map((s) => ({ name: s.name })) ?? [],
    languages: values.languages?.map((l) => ({ name: l.name, level: l.level })) ?? [],
  }
}

export default async function CurriculoRenderPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const payload = getTempData(token)

  if (!payload) {
    notFound()
  }

  const { formData, layout, photoDataUrl } = payload
  const fontZoom = RESUME_FONT_SIZE_OPTIONS.find((o) => o.value === layout.fontSize)?.zoom ?? 1.0
  const templateData = toTemplateData(formData, photoDataUrl ?? null)

  return (
    <ResumeRenderer
      templateId={layout.templateId}
      data={templateData}
      color={layout.color}
      fontVar={layout.fontVar}
      fontZoom={fontZoom}
    />
  )
}
