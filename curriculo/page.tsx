import ResumeBuilderForm from "@/components/resume-builder-form";
import PageWrapper from "@/components/page-wrapper";
import type { Metadata } from "next";
import type { TemplateId } from "@/components/resume-templates/config";
import { TEMPLATE_IDS } from "@/components/resume-templates/config";

export const metadata: Metadata = {
  title: "Criar Currículo | Floripa Empregos",
  robots: { index: false, follow: false },
};

export default async function CreateResumePage({
  searchParams,
}: {
  searchParams: Promise<{ resumeId?: string; template?: string }>;
}) {
  const { resumeId, template } = await searchParams;
  const initialTemplate: TemplateId =
    TEMPLATE_IDS.includes(template as TemplateId) ? (template as TemplateId) : "classic";

  return (
    <PageWrapper>
      <div className="spacing content py-6 md:py-10">
        <ResumeBuilderForm resumeId={resumeId} initialTemplate={initialTemplate} />
      </div>
    </PageWrapper>
  );
}
