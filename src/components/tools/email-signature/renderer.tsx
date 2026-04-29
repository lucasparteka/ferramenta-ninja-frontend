import { BannerTemplate } from "./templates/banner-template";
import { ClassicTemplate } from "./templates/classic-template";
import { MinimalTemplate } from "./templates/minimal-template";
import { ModernTemplate } from "./templates/modern-template";
import { PhotoTemplate } from "./templates/photo-template";
import { ProfessionalTemplate } from "./templates/professional-template";
import type { EmailSignatureData } from "./types";

export function SignatureRenderer(data: EmailSignatureData) {
	switch (data.template) {
		case "minimal":
			return MinimalTemplate(data);
		case "professional":
			return ProfessionalTemplate(data);
		case "modern":
			return ModernTemplate(data);
		case "classic":
			return ClassicTemplate(data);
		case "photo":
			return PhotoTemplate(data);
		case "banner":
			return BannerTemplate(data);
		default:
			return MinimalTemplate(data);
	}
}
