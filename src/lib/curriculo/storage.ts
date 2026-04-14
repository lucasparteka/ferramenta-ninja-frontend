import type { ResumeFormValues } from "@/components/tools/curriculo/resume-builder/types";
import type {
	ResumeFontSize,
	ResumeFontVar,
	TemplateId,
} from "@/components/tools/curriculo/resume-templates/config";

const STORAGE_KEY = "curriculo-builder";

type StoredLayout = {
	template: TemplateId;
	color: string;
	font: ResumeFontVar;
	size: ResumeFontSize;
};

type StoredData = {
	formData: ResumeFormValues;
	layout: StoredLayout;
};

export function saveToLocalStorage(
	formData: ResumeFormValues,
	layout: StoredLayout,
): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, layout }));
	} catch {}
}

export function loadFromLocalStorage(): StoredData | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as StoredData;
	} catch {
		return null;
	}
}

export function clearLocalStorage(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {}
}

export function maskPhone(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	if (digits.length <= 2) return digits.length ? `(${digits}` : "";
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10)
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
