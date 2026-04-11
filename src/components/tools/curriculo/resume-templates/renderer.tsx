import type { ResumeTemplateData } from "./types"
import type { TemplateId } from "./config"
import { ClassicTemplate } from "./classic"
import { TraditionalTemplate } from "./traditional"
import { MinimalistTemplate } from "./minimalist"
import { ExecutivoTemplate } from "./executivo"
import { ModernoTemplate } from "./moderno"
import { EleganteTemplate } from "./elegante"

type ResumeRendererProps = {
  templateId: TemplateId
  data: ResumeTemplateData
  color?: string
  fontVar?: string
  fontZoom?: number
}

export function ResumeRenderer({ templateId, data, color, fontVar, fontZoom }: ResumeRendererProps) {
  switch (templateId) {
    case "classic":
      return <ClassicTemplate data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
    case "traditional":
      return <TraditionalTemplate data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
    case "minimalist":
      return <MinimalistTemplate data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
    case "executivo":
      return <ExecutivoTemplate data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
    case "moderno":
      return <ModernoTemplate data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
    case "elegante":
      return <EleganteTemplate data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
  }
}
