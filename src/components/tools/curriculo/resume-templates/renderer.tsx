import { ClassicTemplate } from "./classic";
import type { TemplateId } from "./config";
import { EleganteTemplate } from "./elegante";
import { ExecutivoTemplate } from "./executivo";
import { MinimalistTemplate } from "./minimalist";
import { ModernoTemplate } from "./moderno";
import styles from "./resume-renderer.module.css";
import { TraditionalTemplate } from "./traditional";
import type { ResumeTemplateData } from "./types";

type ResumeRendererProps = {
	templateId: TemplateId;
	data: ResumeTemplateData;
	color?: string;
	fontVar?: string;
	fontZoom?: number;
};

export function ResumeRenderer({
	templateId,
	data,
	color,
	fontVar,
	fontZoom,
}: ResumeRendererProps) {
	function renderTemplate() {
		switch (templateId) {
			case "classic":
				return (
					<ClassicTemplate
						data={data}
						color={color}
						fontVar={fontVar}
						fontZoom={fontZoom}
					/>
				);
			case "traditional":
				return (
					<TraditionalTemplate
						data={data}
						color={color}
						fontVar={fontVar}
						fontZoom={fontZoom}
					/>
				);
			case "minimalist":
				return (
					<MinimalistTemplate
						data={data}
						color={color}
						fontVar={fontVar}
						fontZoom={fontZoom}
					/>
				);
			case "executivo":
				return (
					<ExecutivoTemplate
						data={data}
						color={color}
						fontVar={fontVar}
						fontZoom={fontZoom}
					/>
				);
			case "moderno":
				return (
					<ModernoTemplate
						data={data}
						color={color}
						fontVar={fontVar}
						fontZoom={fontZoom}
					/>
				);
			case "elegante":
				return (
					<EleganteTemplate
						data={data}
						color={color}
						fontVar={fontVar}
						fontZoom={fontZoom}
					/>
				);
		}
	}

	return <div className={styles.wrapper}>{renderTemplate()}</div>;
}
