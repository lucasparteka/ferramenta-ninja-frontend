"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Eye,
  Save,
  Maximize2,
  RotateCcw,
  UserCircle2,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { resumeFormSchema, type ResumeFormValues } from "./types"
import { ExperienceSection } from "./experience-section"
import { EducationSection } from "./education-section"
import { SkillsSection } from "./skills-section"
import { LanguagesSection } from "./languages-section"
import { SocialLinksSection } from "./social-links-section"
import { TemplateSelector } from "./template-selector"
import { ResumePreviewModal } from "@/components/tools/curriculo/resume-preview-modal"
import { ResumePdfButton } from "@/components/tools/curriculo/resume-pdf-button"
import { ScaledResume } from "@/components/tools/curriculo/resume-templates/scaled-resume"
import type { ResumeTemplateData } from "@/components/tools/curriculo/resume-templates/types"
import type { TemplateId } from "@/components/tools/curriculo/resume-templates/config"
import {
  RESUME_FONT_SIZE_OPTIONS,
  DEFAULT_LAYOUT,
  type ResumeFontVar,
  type ResumeFontSize,
} from "@/components/tools/curriculo/resume-templates/config"
import { saveToLocalStorage, loadFromLocalStorage, maskPhone } from "@/lib/curriculo/storage"

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-primary shrink-0" />}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function LivePreviewPanel({
  templateId,
  data,
  color,
  fontVar,
  fontZoom,
}: {
  templateId: TemplateId
  data: ResumeTemplateData
  color: string
  fontVar?: string
  fontZoom?: number
}) {
  return (
    <ScaledResume
      templateId={templateId}
      data={data}
      color={color}
      fontVar={fontVar}
      fontZoom={fontZoom}
      className="shadow-xl ring-1 ring-black/5 rounded-sm"
    />
  )
}

function toPreviewData(values: ResumeFormValues, photoUrl: string | null): ResumeTemplateData {
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

export function ResumeBuilder() {
  const [hasSavedData, setHasSavedData] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_LAYOUT.template)
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_LAYOUT.color)
  const [fontVar, setFontVar] = useState<ResumeFontVar>(DEFAULT_LAYOUT.font)
  const [fontSize, setFontSize] = useState<ResumeFontSize>(DEFAULT_LAYOUT.size)

  const fontZoom = RESUME_FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.zoom ?? 1.0

  const savedLayoutRef = useRef({ template: templateId, color: accentColor, font: fontVar, size: fontSize })

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema) as Resolver<ResumeFormValues>,
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: "",
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      socialLinks: [],
    },
  })

  const watchedValues = useWatch({ control: form.control })

  const { isDirty } = form.formState
  const saved = savedLayoutRef.current
  const hasLayoutChanges =
    templateId !== saved.template ||
    accentColor !== saved.color ||
    fontVar !== saved.font ||
    fontSize !== saved.size
  const hasPendingChanges = isDirty || photoFile !== null || hasLayoutChanges

  const livePreviewData = useMemo<ResumeTemplateData>(
    () => toPreviewData(watchedValues as ResumeFormValues, photoPreviewUrl),
    [watchedValues, photoPreviewUrl]
  )

  useEffect(() => {
    const stored = loadFromLocalStorage()
    if (!stored) return

    const { formData, layout } = stored
    form.reset(formData, { keepDefaultValues: false })
    setTemplateId(layout.template)
    setAccentColor(layout.color)
    setFontVar(layout.font)
    setFontSize(layout.size)
    savedLayoutRef.current = layout
    setHasSavedData(true)
  }, [])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    setPhotoFile(file)
    setPhotoPreviewUrl(URL.createObjectURL(file))
  }

  function handleRemovePhoto() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    setPhotoFile(null)
    setPhotoPreviewUrl(null)
  }

  function handleSubmit(data: ResumeFormValues) {
    const layout = { template: templateId, color: accentColor, font: fontVar, size: fontSize }
    saveToLocalStorage(data, layout)
    savedLayoutRef.current = layout
    setHasSavedData(true)
    form.reset(data, { keepValues: true, keepDirty: false })
    toast.success("Currículo salvo com sucesso!")
  }

  function scrollToFirstError() {
    const firstInvalid = document.querySelector('[aria-invalid="true"]')
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  function handleRevert() {
    const stored = loadFromLocalStorage()
    if (stored) {
      form.reset(stored.formData)
      setTemplateId(stored.layout.template)
      setAccentColor(stored.layout.color)
      setFontVar(stored.layout.font)
      setFontSize(stored.layout.size)
      savedLayoutRef.current = stored.layout
    } else {
      form.reset()
    }
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    setPhotoFile(null)
    setPhotoPreviewUrl(null)
  }

  const photoSection = (
    <div className="flex items-center gap-4">
      <div className="relative">
        {photoPreviewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoPreviewUrl}
            alt="Foto de perfil"
            className="w-16 h-16 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
            <UserCircle2 size={28} className="text-muted-foreground" />
          </div>
        )}
        {photoPreviewUrl && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            aria-label="Remover foto"
          >
            <X size={11} />
          </button>
        )}
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Foto de perfil</label>
        <label className="cursor-pointer">
          <span className="text-xs text-primary underline underline-offset-2">
            {photoPreviewUrl ? "Trocar foto" : "Adicionar foto"}
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">PNG ou JPEG, máx. 3 MB</p>
      </div>
    </div>
  )

  const formContent = (
    <div className="space-y-8">
      <div>
        <SectionCard title="Configurações de Template">
          <TemplateSelector
            templateId={templateId}
            color={accentColor}
            fontVar={fontVar}
            fontSize={fontSize}
            onTemplateChange={setTemplateId}
            onColorChange={setAccentColor}
            onFontVarChange={setFontVar}
            onFontSizeChange={setFontSize}
          />
        </SectionCard>
      </div>
      <Separator />
      <SectionCard title="Informações Pessoais">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {photoSection}
          <div className="flex-1 w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Maria Souza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título profissional *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Desenvolvedor Full Stack" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(48) 99999-9999"
                    {...field}
                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Florianópolis, SC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo profissional</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva um breve resumo sobre você, suas experiências e objetivos profissionais..."
                  rows={7}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </SectionCard>
      <Separator />
      <SectionCard title="Experiências Profissionais">
        <ExperienceSection />
      </SectionCard>
      <Separator />
      <SectionCard title="Formações Acadêmicas">
        <EducationSection />
      </SectionCard>
      <Separator />
      <SectionCard title="Habilidades">
        <SkillsSection />
      </SectionCard>
      <Separator />
      <SectionCard title="Idiomas">
        <LanguagesSection />
      </SectionCard>
      <Separator />
      <SectionCard title="Links e Redes Sociais">
        <SocialLinksSection />
      </SectionCard>
      <Separator />
      <div className="hidden lg:flex flex-col gap-2 pt-6 pb-8">
        {hasPendingChanges && (
          <p className="flex items-center justify-end gap-1.5 text-sm text-amber-600 w-full ml-auto mb-2 italic">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            Alterações não salvas
          </p>
        )}
        <div className="flex items-center justify-end gap-3">
          {hasSavedData && hasPendingChanges && (
            <Button type="button" variant="link" size="lg" className="mr-auto text-muted-foreground px-0" onClick={handleRevert}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reverter alterações
            </Button>
          )}
          <ResumePdfButton
            templateId={templateId}
            data={livePreviewData}
            color={accentColor}
            fontVar={fontVar}
            fontSize={fontSize}
            size="lg"
            hasPendingChanges={hasPendingChanges}
            formData={watchedValues as ResumeFormValues}
            photoFile={photoFile}
          />
          <Button type="submit" size="lg" className="min-w-40" disabled={hasSavedData && !hasPendingChanges}>
            <Save className="h-4 w-4 mr-2" />
            {hasSavedData ? "Salvar alterações" : "Salvar currículo"}
          </Button>
        </div>
      </div>
      {hasPendingChanges && hasSavedData && (
        <div className="lg:hidden flex items-center justify-between gap-3 pt-4">
          <p className="flex items-center gap-1.5 text-sm text-amber-600 italic">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            Alterações não salvas
          </p>
          <Button type="button" variant="link" size="sm" className="text-muted-foreground px-0 shrink-0" onClick={handleRevert}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reverter
          </Button>
        </div>
      )}
      <div className="lg:hidden pt-4">
        <ResumePdfButton
          templateId={templateId}
          data={livePreviewData}
          color={accentColor}
          fontVar={fontVar}
          fontSize={fontSize}
          className="w-full"
          hasPendingChanges={hasPendingChanges}
          formData={watchedValues as ResumeFormValues}
          photoFile={photoFile}
        />
      </div>
    </div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, scrollToFirstError)}>
        <div className="hidden lg:flex gap-8 items-start">
          <div className="w-[480px] xl:w-[640px] shrink-0">
            {formContent}
          </div>

          <div className="flex-1 sticky top-22 min-w-0 shadow">
            <div className="bg-slate-100">
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Pré-visualização</p>
                  <span className={`ml-2 flex items-center gap-1 text-xs text-amber-600 italic transition-opacity duration-300 ${hasPendingChanges ? "opacity-100" : "opacity-0"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Alterações não salvas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-black/10 transition-colors"
                  title="Expandir pré-visualização"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-1">
                <LivePreviewPanel
                  templateId={templateId}
                  data={livePreviewData}
                  color={accentColor}
                  fontVar={fontVar}
                  fontZoom={fontZoom}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          {formContent}
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t px-4 py-3 flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button type="submit" className="flex-1" disabled={hasSavedData && !hasPendingChanges}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </form>

      <ResumePreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={livePreviewData}
        templateId={templateId}
        color={accentColor}
        fontVar={fontVar}
        fontSize={fontSize}
        onTemplateChange={setTemplateId}
        onColorChange={setAccentColor}
        onFontVarChange={setFontVar}
        onFontSizeChange={setFontSize}
        showTemplateControls
        hasPendingChanges={hasPendingChanges}
        onSave={hasPendingChanges ? () => form.handleSubmit(handleSubmit)() : undefined}
        formData={watchedValues as ResumeFormValues}
        photoFile={photoFile}
      />
    </Form>
  )
}
