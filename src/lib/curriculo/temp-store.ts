import type { ResumeFormValues } from "@/components/tools/curriculo/resume-builder/types";
import type {
	ResumeFontSize,
	ResumeFontVar,
	TemplateId,
} from "@/components/tools/curriculo/resume-templates/config";

export type RenderPayload = {
	formData: ResumeFormValues;
	layout: {
		templateId: TemplateId;
		color: string;
		fontVar: ResumeFontVar;
		fontSize: ResumeFontSize;
	};
	photoDataUrl?: string;
};

type Entry = {
	data: RenderPayload;
	expiresAt: number;
};

const TTL_MS = 2 * 60 * 1000;

const globalStore = globalThis as typeof globalThis & {
	__resumeTempStore?: Map<string, Entry>;
};
if (!globalStore.__resumeTempStore) {
	globalStore.__resumeTempStore = new Map<string, Entry>();
}
const store = globalStore.__resumeTempStore;

export function setTempData(token: string, data: RenderPayload): void {
	store.set(token, { data, expiresAt: Date.now() + TTL_MS });
}

export function getTempData(token: string): RenderPayload | null {
	const entry = store.get(token);
	if (!entry) return null;
	store.delete(token);
	if (Date.now() > entry.expiresAt) return null;
	return entry.data;
}
