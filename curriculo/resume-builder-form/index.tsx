"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  Eye,
  Save,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogoUploader from "@/components/logo-uploader";
import GlobalLoading from "@/components/global-loading";
import { maskPhone } from "@/utils/string";
import { getResumePhotoUrl, getResumeById, getResumesByUser, getResumeWithRelationsById, updateResumeLayout, DEFAULT_LAYOUT } from "@/services/resume";
import type { ResumeLayout } from "@/services/resume";
import { pb } from "@/services/pocketbase";
import { resumeFormSchema, type ResumeFormValues } from "./types";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { SkillsSection } from "./skills-section";
import { LanguagesSection } from "./languages-section";
import { SocialLinksSection } from "./social-links-section";
import { SaveRegistrationModal } from "./save-registration-modal";
import { TemplateSelector } from "./template-selector";
import { useAuth } from "@/contexts/use-auth";
import Loader from "@/components/loader";
import { ResumePreviewModal } from "@/components/resume-preview-modal";
import { ResumePdfButton } from "@/components/resume-pdf-button";
import AdSense from "@/components/adsense";
import { ScaledResume } from "@/components/resume-templates/scaled-resume";
import type { ResumeTemplateData } from "@/components/resume-templates/types";
import type { TemplateId } from "@/components/resume-templates/config";
import {
  RESUME_FONT_SIZE_OPTIONS,
  type ResumeFontVar,
  type ResumeFontSize,
} from "@/components/resume-templates/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── BFF helpers ─────────────────────────────────────────────────────────────

type LimitResumeEntry = { id: string; title: string; updated: string };

class ResumeLimitError extends Error {
  resumes: LimitResumeEntry[];
  constructor(resumes: LimitResumeEntry[]) {
    super("RESUME_LIMIT_REACHED");
    this.name = "ResumeLimitError";
    this.resumes = resumes;
  }
}

async function callSaveAPI(
  data: ResumeFormValues,
  existingResumeId?: string,
  overwriteResumeId?: string
): Promise<string> {
  const res = await fetch("/api/resumes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pb.authStore.token}`,
    },
    body: JSON.stringify({
      name: data.name,
      headline: data.headline,
      email: data.email,
      phone: data.phone,
      location: data.location,
      title: data.title,
      summary: data.summary,
      skills: data.skills,
      languages: data.languages,
      socialLinks: data.socialLinks,
      experiences: data.experiences,
      educations: data.education,
      ...(existingResumeId && { existingResumeId }),
      ...(overwriteResumeId && { overwriteResumeId }),
    }),
  });

  if (res.status === 409) {
    const body = await res.json();
    throw new ResumeLimitError(body.resumes as LimitResumeEntry[]);
  }

  if (!res.ok) throw new Error("Failed to save resume");

  const json = await res.json();
  return json.resumeId as string;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-primary shrink-0" />}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Live preview panel ───────────────────────────────────────────────────────

function LivePreviewPanel({
  templateId,
  data,
  color,
  fontVar,
  fontZoom,
  isLoading,
}: {
  templateId: TemplateId;
  data: ResumeTemplateData;
  color: string;
  fontVar?: string;
  fontZoom?: number;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-white" style={{ aspectRatio: "210/297" }}>
        <Loader />
      </div>
    );
  }
  return (
    <ScaledResume
      templateId={templateId}
      data={data}
      color={color}
      fontVar={fontVar}
      fontZoom={fontZoom}
      className="shadow-xl ring-1 ring-black/5 rounded-sm"
    />
  );
}

// ─── Derive preview data from form values ─────────────────────────────────────

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
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResumeBuilderForm({ resumeId, initialTemplate }: { resumeId?: string; initialTemplate?: TemplateId }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const isEditing = !!resumeId;

  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | "" | undefined>(undefined);
  const [initialPhotoUrl, setInitialPhotoUrl] = useState<string | null>(null);
  const [savedResumeId, setSavedResumeId] = useState<string | undefined>();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<ResumeFormValues | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [limitResumes, setLimitResumes] = useState<LimitResumeEntry[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Template + color + font state
  const [templateId, setTemplateId] = useState<TemplateId>((initialTemplate ?? DEFAULT_LAYOUT.template) as TemplateId);
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_LAYOUT.color);
  const [fontVar, setFontVar] = useState<ResumeFontVar>(DEFAULT_LAYOUT.font as ResumeFontVar);
  const [fontSize, setFontSize] = useState<ResumeFontSize>(DEFAULT_LAYOUT.size as ResumeFontSize);

  const fontZoom = RESUME_FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.zoom ?? 1.0;

  // Tracks layout state as of the last explicit save/load, so we can detect
  // pending layout changes and revert them.
  const savedLayoutRef = useRef({ template: templateId, color: accentColor, font: fontVar, size: fontSize });

  function applyLayout(layout: ResumeLayout) {
    const t = (layout.template as TemplateId) ?? templateId;
    const c = layout.color ?? accentColor;
    const f = (layout.font as ResumeFontVar) ?? fontVar;
    const s = (layout.size as ResumeFontSize) ?? fontSize;
    if (layout.template) setTemplateId(t);
    if (layout.color) setAccentColor(c);
    if (layout.font) setFontVar(f);
    if (layout.size) setFontSize(s);
    savedLayoutRef.current = { template: t, color: c, font: f, size: s };
  }

  function handleTemplateChange(id: TemplateId) { setTemplateId(id); }
  function handleColorChange(color: string) { setAccentColor(color); }
  function handleFontVarChange(font: ResumeFontVar) { setFontVar(font); }
  function handleFontSizeChange(size: ResumeFontSize) { setFontSize(size); }

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
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
  });

  // Watch all fields for live preview
  const watchedValues = useWatch({ control: form.control });

  // Pending changes: RHF dirty flag + photo + layout (template/color/font/size)
  const { isDirty } = form.formState;
  const saved = savedLayoutRef.current;
  const hasLayoutChanges =
    templateId !== saved.template ||
    accentColor !== saved.color ||
    fontVar !== saved.font ||
    fontSize !== saved.size;
  const hasPendingChanges = isDirty || avatarFile !== undefined || hasLayoutChanges;

  // Derive preview photo URL from current avatar state
  const previewPhotoUrl = useMemo<string | null>(() => {
    if (avatarFile === "") return null;
    if (avatarFile instanceof File) return URL.createObjectURL(avatarFile);
    return initialPhotoUrl;
  }, [avatarFile, initialPhotoUrl]);

  // Derive live preview data
  const livePreviewData = useMemo<ResumeTemplateData>(
    () => toPreviewData(watchedValues as ResumeFormValues, previewPhotoUrl),
    [watchedValues, previewPhotoUrl]
  );

  // Load existing resume data on mount
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setIsInitializing(false);
      return;
    }

    setIsInitializing(true);

    async function loadExistingData() {
      try {
        if (isEditing) {
          const existing = await getResumeWithRelationsById(resumeId!);
          if (existing) {
            const { resume, expRecord, eduRecord } = existing;
            setSavedResumeId(resume.id);
            if (resume.photo) setInitialPhotoUrl(getResumePhotoUrl(resume));
            if (resume.layout) applyLayout(resume.layout as ResumeLayout);
            form.reset({
              name: resume.name || user!.name || "",
              headline: (resume as unknown as Record<string, unknown>).headline as string || "",
              email: resume.email || user!.email || "",
              phone: resume.phone || "",
              location: resume.location || "",
              title: resume.title || "",
              summary: resume.summary || "",
              skills: (resume.skills as ResumeFormValues["skills"]) || [],
              languages: (resume.languages as ResumeFormValues["languages"]) || [],
              socialLinks: (resume.socialLinks as ResumeFormValues["socialLinks"]) || [],
              experiences: (expRecord?.experiences as ResumeFormValues["experiences"]) || [],
              education: (eduRecord?.educations as ResumeFormValues["education"]) || [],
            });
          }
        } else {
          const existing = await getResumesByUser(user!.id);
          if (existing.length >= 3) {
            toast.warning("Você já possui 3 currículos salvos. Edite ou remova um antes de criar outro.");
            router.replace("/candidato");
            return;
          }
          form.reset({
            ...form.getValues(),
            name: user!.name || "",
            email: user!.email || "",
          });
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
      } finally {
        setIsInitializing(false);
      }
    }

    loadExistingData();
  }, [user?.id, isAuthLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePhotoUpload(resumeId: string) {
    if (avatarFile === undefined) return;

    if (avatarFile === "") {
      await pb.collection("resumes").update(resumeId, { "photo": null });
      setInitialPhotoUrl(null);
    } else {
      await pb.collection("resumes").update(resumeId, { photo: avatarFile });
      const resume = await getResumeById(resumeId);
      if (resume?.photo) setInitialPhotoUrl(getResumePhotoUrl(resume));
    }
    setAvatarFile(undefined);
  }

  async function handleSubmit(data: ResumeFormValues) {
    if (!user) {
      setPendingFormData(data);
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const newId = await callSaveAPI(data, savedResumeId);
      await handlePhotoUpload(newId);
      const layout = { template: templateId, color: accentColor, font: fontVar, size: fontSize };
      await updateResumeLayout(newId, layout);
      savedLayoutRef.current = layout;
      setSavedResumeId(newId);
      toast.success(savedResumeId ? "Currículo atualizado!" : "Currículo salvo com sucesso!");
      form.reset(data, { keepValues: true, keepDirty: false });
    } catch (error) {
      if (error instanceof ResumeLimitError) {
        setLimitResumes(error.resumes);
        setPendingFormData(data);
        setShowLimitDialog(true);
      } else {
        console.error(error);
        toast.error("Erro ao salvar currículo. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function scrollToFirstError() {
    const firstInvalid = document.querySelector('[aria-invalid="true"]');
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleRevert() {
    form.reset();
    setAvatarFile(undefined);
    const s = savedLayoutRef.current;
    setTemplateId(s.template);
    setAccentColor(s.color);
    setFontVar(s.font);
    setFontSize(s.size);
  }

  async function handleAuthSuccess() {
    if (!pendingFormData) return;
    setShowAuthModal(false);
    setIsLoading(true);
    try {
      const newId = await callSaveAPI(pendingFormData, savedResumeId);
      await handlePhotoUpload(newId);
      const layout = { template: templateId, color: accentColor, font: fontVar, size: fontSize };
      await updateResumeLayout(newId, layout);
      savedLayoutRef.current = layout;
      setSavedResumeId(newId);
      toast.success("Currículo salvo com sucesso!");
      form.reset(pendingFormData, { keepValues: true, keepDirty: false });
      setPendingFormData(null);
    } catch (error) {
      if (error instanceof ResumeLimitError) {
        setLimitResumes(error.resumes);
        setShowLimitDialog(true);
      } else {
        console.error(error);
        toast.error("Erro ao salvar currículo. Tente novamente.");
        setPendingFormData(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOverwriteOldest() {
    if (!pendingFormData || limitResumes.length === 0) return;
    setShowLimitDialog(false);
    setIsLoading(true);
    try {
      const oldest = limitResumes[0];
      const newId = await callSaveAPI(pendingFormData, undefined, oldest.id);
      await handlePhotoUpload(newId);
      const layout = { template: templateId, color: accentColor, font: fontVar, size: fontSize };
      await updateResumeLayout(newId, layout);
      savedLayoutRef.current = layout;
      setSavedResumeId(newId);
      toast.success("Currículo substituído com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar currículo. Tente novamente.");
    } finally {
      setIsLoading(false);
      setPendingFormData(null);
      setLimitResumes([]);
    }
  }

  const formContent = (
    <div className="space-y-8">
      <div>
        <SectionCard title="Configurações de Template">
          <TemplateSelector
            templateId={templateId}
            color={accentColor}
            fontVar={fontVar}
            fontSize={fontSize}
            onTemplateChange={handleTemplateChange}
            onColorChange={handleColorChange}
            onFontVarChange={handleFontVarChange}
            onFontSizeChange={handleFontSizeChange}
          />
        </SectionCard>
      </div>
      <Separator />
      <SectionCard title="Informações Pessoais">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <LogoUploader
            label="Foto de perfil"
            initialUrl={initialPhotoUrl}
            onChange={setAvatarFile}
            maxFileSizeBytes={3 * 1024 * 1024}
            acceptedTypes={["image/png", "image/jpeg"]}
          />
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
      <Separator className="" />
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
          {savedResumeId && hasPendingChanges && (
            <Button type="button" variant="link" size="lg" className="mr-auto text-muted-foreground px-0" onClick={handleRevert}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reverter alterações
            </Button>
          )}
          {savedResumeId && (
            <ResumePdfButton
              resumeId={savedResumeId}
              templateId={templateId}
              data={livePreviewData}
              color={accentColor}
              fontVar={fontVar}
              fontSize={fontSize}
              size="lg"
              hasPendingChanges={hasPendingChanges}
            />
          )}
          <Button type="submit" size="lg" className="min-w-40" disabled={!!savedResumeId && !hasPendingChanges}>
            <Save className="h-4 w-4 mr-2" />
            {savedResumeId ? "Salvar alterações" : "Salvar currículo"}
          </Button>
        </div>
      </div>
      {/* Mobile: pending changes info + revert — mirrors desktop block */}
      {hasPendingChanges && savedResumeId && (
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
      {savedResumeId && (
        <div className="lg:hidden pt-4">
          <ResumePdfButton
            resumeId={savedResumeId}
            templateId={templateId}
            data={livePreviewData}
            color={accentColor}
            fontVar={fontVar}
            fontSize={fontSize}
            className="w-full"
            hasPendingChanges={hasPendingChanges}
          />
        </div>
      )}
      {/* Spacer when no PDF button is shown */}
      {!savedResumeId && <div className="h-20 lg:hidden" />}
    </div>
  );

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, scrollToFirstError)}>
        {/* ── Desktop: side-by-side layout ── */}
        <div className="hidden lg:flex gap-8 items-start">
          {/* Form column */}
          <div className="w-[480px] xl:w-[640px] shrink-0">
            {formContent}
          </div>

          {/* Live preview column */}
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
                <LivePreviewPanel templateId={templateId} data={livePreviewData} color={accentColor} fontVar={fontVar} fontZoom={fontZoom} isLoading={isInitializing} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: single column ── */}
        <div className="lg:hidden">
          {isInitializing ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <Loader />
            </div>
          ) : formContent}
        </div>

        {/* ── Mobile fixed bottom bar ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t px-4 py-3 flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button type="submit" className="flex-1" disabled={!!savedResumeId && !hasPendingChanges}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </form>

      <GlobalLoading isOpen={isLoading} />

      <SaveRegistrationModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
        initialName={form.getValues("name")}
        initialEmail={form.getValues("email")}
      />

      <ResumePreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={livePreviewData}
        templateId={templateId}
        color={accentColor}
        fontVar={fontVar}
        fontSize={fontSize}
        onTemplateChange={handleTemplateChange}
        onColorChange={handleColorChange}
        onFontVarChange={handleFontVarChange}
        onFontSizeChange={handleFontSizeChange}
        resumeId={savedResumeId}
        showTemplateControls
        hasPendingChanges={hasPendingChanges}
        onSave={hasPendingChanges ? () => form.handleSubmit(handleSubmit)() : undefined}
      />

      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limite de currículos atingido</AlertDialogTitle>
            <AlertDialogDescription>
              Você já possui 3 currículos salvos. Para salvar este, é necessário substituir o mais
              antigo:{" "}
              <strong>{limitResumes[0]?.title || "Currículo sem título"}</strong> (atualizado em{" "}
              {limitResumes[0] ? new Date(limitResumes[0].updated).toLocaleDateString("pt-BR") : "—"}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowLimitDialog(false);
                setPendingFormData(null);
                setLimitResumes([]);
              }}
            >
              Descartar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleOverwriteOldest}>
              Substituir o mais antigo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
    <AdSense adFormat="horizontal" className="mt-8" />
    </>
  );
}
