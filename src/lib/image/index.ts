export type { CompressionResult } from "./compress";
export { compressImage } from "./compress";
export type { ConvertResult } from "./convert";
export { convertImage, getFormatLabel } from "./convert";
export type { ImageInfo } from "./info";
export { formatBytes, getFileFormat, getImageInfo } from "./info";
export type { AspectRatioResult, ResizeMode, ResizeResult } from "./resize";
export { calculateAspectRatio, resizeImage } from "./resize";
export type {
	FaviconMode,
	FaviconPackage,
	FaviconSize,
	GeneratedFaviconFile,
} from "./favicon";
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
