export type ChecklistItemKind = "item" | "group";

export type ChecklistItem = {
	text: string;
	kind: ChecklistItemKind;
};

export type ChecklistLayout = {
	columns: 1 | 2;
	showCheckbox: boolean;
	showDividers: boolean;
	spacing: "compact" | "comfortable";
	writingLines: number;
};

export type ChecklistStyle = {
	fontSize: "sm" | "md" | "lg";
	titleAlign: "left" | "center";
	backgroundColor: string;
};

export type ChecklistTemplate = {
	id: string;
	name: string;
	layout: ChecklistLayout;
	style: ChecklistStyle;
	content: { title: string; items: ChecklistItem[] };
};

export type ChecklistHeader = {
	enabled: boolean;
	subtitle: string;
	date: string;
	name: string;
	backgroundColor: string;
};

export type ChecklistState = {
	title: string;
	items: ChecklistItem[];
	layout: ChecklistLayout;
	style: ChecklistStyle;
	header: ChecklistHeader;
};

export type CanvasHandle = {
	getDataURL: () => string;
};
