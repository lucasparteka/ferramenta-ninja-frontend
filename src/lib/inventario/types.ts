export type InventarioColumn = {
	id: string;
	label: string;
	width: number;
};

export type InventarioHeaderField = {
	id: string;
	label: string;
	value: string;
};

export type InventarioState = {
	title: string;
	orientation: "portrait" | "landscape";
	tableHeaderColor: string;
	zebraStripes: boolean;
	headerFields: InventarioHeaderField[];
	columns: InventarioColumn[];
};

export type CanvasHandle = {
	getDataURL: () => string;
};
