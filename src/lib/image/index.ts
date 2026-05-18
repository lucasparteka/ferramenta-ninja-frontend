export type { CompressionResult } from "./compress";
export { compressImage } from "./compress";
export type { ConvertResult } from "./convert";
export { convertImage, getFormatLabel } from "./convert";
export type { ImageInfo } from "./info";
export { formatBytes, getFileFormat, getImageInfo } from "./info";
export type { AspectRatioResult, ResizeMode, ResizeResult } from "./resize";
export { calculateAspectRatio, resizeImage } from "./resize";
export type { SvgDimensions, SvgToPngOptions, SvgToPngResult } from "./svg";
export {
	loadSvgFromFile,
	parseSvgDimensions,
	svgStringToPng,
	validateSvg,
} from "./svg";
export type {
	FaviconMode,
	FaviconPackage,
	FaviconSize,
	GeneratedFaviconFile,
} from "./favicon";
export type {
	PlaceholderOptions,
	PlaceholderPattern,
	PlaceholderResult,
} from "./placeholder";
export { generatePlaceholder } from "./placeholder";
export {
	createWebManifest,
	createZipPackage,
	FAVICON_SIZES,
	generateFaviconPng,
	generateHtmlTags,
	generateIco,
	ICO_SIZES,
	renderToSize,
} from "./favicon";
