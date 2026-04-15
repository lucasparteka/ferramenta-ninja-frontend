export type ChecklistLayout = {
	columns: 1 | 2;
	showCheckbox: boolean;
	showDividers: boolean;
	spacing: "compact" | "comfortable";
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
	content: { title: string; items: string[] };
};

export type ChecklistState = {
	title: string;
	items: string[];
	layout: ChecklistLayout;
	style: ChecklistStyle;
};

export type CanvasHandle = {
	getDataURL: () => string;
};
