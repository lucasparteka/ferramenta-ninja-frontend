import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import type { ResumeTemplateData } from "./types"

function formatMonthYear(yyyyMM: string): string {
  if (!yyyyMM) return ""
  const [year, month] = yyyyMM.split("-")
  const labels = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
  const m = parseInt(month, 10)
  if (isNaN(m) || m < 1 || m > 12) return year
  return `${labels[m - 1]} ${year}`
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-bold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>{title}</h2>
      <div className="h-px mt-1.5 opacity-30" style={{ backgroundColor: "var(--accent)" }} />
    </div>
  )
}

export function ClassicTemplate({ data, color, fontVar, fontZoom }: { data: ResumeTemplateData; color?: string; fontVar?: string; fontZoom?: number }) {
  const hasExperiences = !!data.experiences?.length
  const hasEducation = !!data.education?.length
  const hasSkills = !!data.skills?.length
  const hasLanguages = !!data.languages?.length
  const hasSocialLinks = !!data.socialLinks?.length

  return (
    <div
      className="bg-white w-full text-[#1a1a1a] text-sm leading-relaxed"
      style={{ "--accent": color ?? "#1b3a5c", fontFamily: fontVar ? `var(${fontVar})` : "var(--font-inter)", zoom: fontZoom } as React.CSSProperties}
    >
      <div className="px-10 pt-6 pb-7 flex items-start justify-between gap-6 border-b-4" style={{ borderColor: "var(--accent)" }}>
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight" style={{ color: "var(--accent)" }}>
            {data.name}
          </h1>
          {data.headline && (
            <p className="text-base mt-1">{data.headline}</p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-base">
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} className="shrink-0" style={{ color: "var(--accent)" }} />
                {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} className="shrink-0" style={{ color: "var(--accent)" }} />
                {data.phone}
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} className="shrink-0" style={{ color: "var(--accent)" }} />
                {data.location}
              </span>
            )}
          </div>
          {hasSocialLinks && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5 text-base text-[#444]">
              {data.socialLinks!.map((link, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ExternalLink size={9} className="shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="font-medium" style={{ color: "var(--accent)" }}>{link.platform}:</span>
                  <span className="text-[#666] truncate max-w-[180px]">
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
        {data.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt={data.name}
            className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#dde4ec] shrink-0"
          />
        )}
      </div>
      <div className="px-10 py-7 space-y-8">
        {data.summary && (
          <section className="section">
            <SectionHeader title="Resumo Profissional" />
            <p className="text-base text-[#333] leading-[1.65]">{data.summary}</p>
          </section>
        )}
        {hasExperiences && (
          <section className="section">
            <SectionHeader title="Experiência Profissional" />
            <div className="space-y-4">
              {data.experiences!.map((exp, i) => (
                <div key={i} className="pdf-item">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-base text-[#111]">{exp.role}</p>
                      <p className="text-base text-neutral-700 mt-0.5">
                        {exp.company}
                        {exp.location ? (
                          <span className="text-neutral-500"> · {exp.location}</span>
                        ) : null}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500 shrink-0 mt-0.5 font-medium">
                      {formatMonthYear(exp.startDate)}
                      {" – "}
                      {exp.isCurrent ? "Atual" : formatMonthYear(exp.endDate || "")}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-base text-[#444] mt-1.5 leading-[1.6] whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                  {i < data.experiences!.length - 1 && (
                    <div className="border-b border-dashed border-[#e8e8e8] mt-4" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {hasEducation && (
          <section className="section">
            <SectionHeader title="Formação Acadêmica" />
            <div className="space-y-4">
              {data.education!.map((edu, i) => (
                <div key={i} className="pdf-item">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-base text-[#111]">
                        {edu.degree}
                        {edu.field ? (
                          <span className="font-normal"> — {edu.field}</span>
                        ) : null}
                      </p>
                      <p className="text-base text-neutral-700 mt-0.5">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-neutral-500 shrink-0 mt-0.5 font-medium">
                      {edu.startYear}
                      {" – "}
                      {edu.isCurrent ? "Atual" : (edu.endYear || "")}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="text-base text-[#444] mt-1.5 leading-[1.6]">{edu.description}</p>
                  )}
                  {i < data.education!.length - 1 && (
                    <div className="border-b border-dashed border-[#e8e8e8] mt-4" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {(hasSkills || hasLanguages) && (
          <div className={hasSkills && hasLanguages ? "grid grid-cols-2 gap-8" : ""}>
            {hasSkills && (
              <section className="section">
                <SectionHeader title="Habilidades" />
                <ul className="space-y-1.5 text-neutral-700">
                  {data.skills!.map((s, i) => (
                    <li key={i} className="text-base flex items-center gap-2">
                      <span className="w-[5px] h-[5px] rounded-full shrink-0 opacity-70" style={{ backgroundColor: "var(--accent)" }} />
                      {s.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {hasLanguages && (
              <section className="section">
                <SectionHeader title="Idiomas" />
                <ul className="space-y-1.5 text-neutral-700">
                  {data.languages!.map((l, i) => (
                    <li key={i} className="text-base flex items-center gap-2">
                      <span className="w-[5px] h-[5px] rounded-full shrink-0 opacity-70" style={{ backgroundColor: "var(--accent)" }} />
                      <span>{l.name}</span>
                      <span>— {l.level}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
