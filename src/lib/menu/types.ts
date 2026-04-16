export type MenuItem = {
	name: string;
	description?: string;
	price?: string;
};

export type MenuData = {
	title: string;
	subtitle?: string;
	logo?: {
		dataUrl: string;
		size: number;
		position: "left" | "center" | "right";
	};
	sections: {
		name: string;
		items: MenuItem[];
	}[];
	style: {
		primaryColor: string;
		backgroundColor: string;
		showPrices: boolean;
		fontFamily: string;
	};
};

export type MenuTemplate = {
	id: string;
	name: string;
	category?: string;
	layout: {
		columns: 1 | 2;
		headerAlign: "left" | "center";
	};
	typography: {
		titleSize: number;
		sectionSize: number;
		itemSize: number;
		priceSize: number;
	};
	spacing: {
		sectionGap: number;
		itemGap: number;
	};
};

export type PageSection = {
	name: string;
	isPartial: boolean;
	items: MenuItem[];
};

export type PageSlice = {
	sections: PageSection[];
};

export type MultiCanvasHandle = {
	getDataURLs: () => string[];
};
