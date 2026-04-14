export type StampStyle = "circle" | "square";

export type SocialNetwork = "facebook" | "instagram" | "whatsapp" | "tiktok" | "website";

export type SocialEntry = {
	network: SocialNetwork;
	handle: string;
};

export type StampCount = 5 | 6 | 8 | 10;

export type TextureType = "dots" | "lines" | "grid" | "stripes";

export type GradientDirection = "to-right" | "to-bottom" | "diagonal";

export type Background =
	| { type: "solid"; color: string }
	| {
			type: "gradient";
			color1: string;
			color2: string;
			direction: GradientDirection;
	  }
	| { type: "texture"; color: string; texture: TextureType };

export type FrontLayout =
	| "classico"
	| "moderno"
	| "dividido"
	| "elegante"
	| "compacto"
	| "minimalista"
	| "negrito"
	| "grade";

export type BackLayout = FrontLayout;

export type Template = {
	id: string;
	name: string;
	frontLayout: FrontLayout;
	backLayout: BackLayout;
	defaultFront: { primaryColor: string; background: Background };
	defaultBack: { primaryColor: string; background: Background };
};

export type FrontData = {
	businessName: string;
	slogan: string;
	contactInfo: string;
	socialEntries: SocialEntry[];
	primaryColor: string;
	background: Background;
	logoFile: File | null;
	logoPreview: string | null;
};

export type BackData = {
	stampCount: StampCount;
	stampStyle: StampStyle;
	rewardText: string;
	rulesText: string;
	whatsapp: string;
	extraText: string;
	primaryColor: string;
	background: Background;
};

export type CanvasHandle = {
	getDataURL: () => string;
};
