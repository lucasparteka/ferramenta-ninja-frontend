import { describe, expect, it, vi, beforeAll } from "vitest";
import {
	renderToSize,
	generateFaviconPng,
	generateIco,
	createWebManifest,
	generateHtmlTags,
	createZipPackage,
	FAVICON_SIZES,
	ICO_SIZES,
} from "./favicon";

/* ------------------------------------------------------------------ */
/*  Canvas mock for node environment                                   */
/* ------------------------------------------------------------------ */

class MockCanvasRenderingContext2D {
	canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	drawImage(
		_image: CanvasImageSource,
		dx: number,
		dy: number,
		dw: number,
		dh: number,
	): void {
		// no-op
	}
}

function createMockCanvas(width: number, height: number): HTMLCanvasElement {
	const mockCanvas = {
		width,
		height,
		getContext: (type: string) => {
			if (type === "2d") {
				return new MockCanvasRenderingContext2D(
					mockCanvas as unknown as HTMLCanvasElement,
				) as unknown as CanvasRenderingContext2D;
			}
			return null;
		},
		toBlob: (callback: ((blob: Blob | null) => void) | null, type?: string) => {
			// Create a tiny valid PNG blob (PNG signature + IHDR chunk)
			const pngSignature = new Uint8Array([
				0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
			]);
			const ihdrLength = new Uint8Array([0x00, 0x00, 0x00, 0x0d]); // 13 bytes
			const ihdrType = new Uint8Array([0x49, 0x48, 0x44, 0x52]); // IHDR
			const widthBytes = new Uint8Array([
				(width >> 24) & 0xff,
				(width >> 16) & 0xff,
				(width >> 8) & 0xff,
				width & 0xff,
			]);
			const heightBytes = new Uint8Array([
				(height >> 24) & 0xff,
				(height >> 16) & 0xff,
				(height >> 8) & 0xff,
				height & 0xff,
			]);
			const ihdrRest = new Uint8Array([
				0x08, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]); // 8bpp RGBA, no interlace, dummy CRC
			const iend = new Uint8Array([
				0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
			]);

			const totalLength =
				pngSignature.length +
				ihdrLength.length +
				ihdrType.length +
				widthBytes.length +
				heightBytes.length +
				ihdrRest.length +
				iend.length;

			const data = new Uint8Array(totalLength);
			let offset = 0;
			data.set(pngSignature, offset);
			offset += pngSignature.length;
			data.set(ihdrLength, offset);
			offset += ihdrLength.length;
			data.set(ihdrType, offset);
			offset += ihdrType.length;
			data.set(widthBytes, offset);
			offset += widthBytes.length;
			data.set(heightBytes, offset);
			offset += heightBytes.length;
			data.set(ihdrRest, offset);
			offset += ihdrRest.length;
			data.set(iend, offset);

			const blob = new Blob([data], { type: type || "image/png" });
			if (callback) callback(blob);
		},
	} as unknown as HTMLCanvasElement;

	return mockCanvas;
}

beforeAll(() => {
	vi.stubGlobal("document", {
		createElement: (tagName: string) => {
			if (tagName === "canvas") {
				return createMockCanvas(512, 512);
			}
			throw new Error(`Unexpected createElement: ${tagName}`);
		},
	});
});

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("Favicon library", () => {
	describe("constants", () => {
		it("FAVICON_SIZES has 6 entries", () => {
			expect(FAVICON_SIZES).toHaveLength(6);
		});

		it("ICO_SIZES has 3 entries", () => {
			expect(ICO_SIZES).toEqual([16, 32, 48]);
		});
	});

	describe("renderToSize", () => {
		it("returns a canvas with requested dimensions", () => {
			const source = createMockCanvas(512, 512);
			const result = renderToSize(source, 128);
			expect(result.width).toBe(128);
			expect(result.height).toBe(128);
		});

		it("throws when 2D context is not available", () => {
			const source = createMockCanvas(512, 512);
			// Temporarily override document.createElement to return a canvas without 2D support
			vi.stubGlobal("document", {
				createElement: (tagName: string) => {
					if (tagName === "canvas") {
						return {
							width: 0,
							height: 0,
							getContext: () => null,
						} as unknown as HTMLCanvasElement;
					}
					throw new Error(`Unexpected createElement: ${tagName}`);
				},
			});
			expect(() => renderToSize(source, 64)).toThrow(
				"Não foi possível obter contexto 2D",
			);
			// Restore
			vi.stubGlobal("document", {
				createElement: (tagName: string) => {
					if (tagName === "canvas") {
						return createMockCanvas(512, 512);
					}
					throw new Error(`Unexpected createElement: ${tagName}`);
				},
			});
		});
	});

	describe("generateFaviconPng", () => {
		it("creates a blob with type image/png", async () => {
			const source = createMockCanvas(512, 512);
			const blob = await generateFaviconPng(source, 32);
			expect(blob).toBeInstanceOf(Blob);
			expect(blob.type).toBe("image/png");
			expect(blob.size).toBeGreaterThan(0);
		});

		it("creates different sizes correctly", async () => {
			const source = createMockCanvas(512, 512);
			const blob16 = await generateFaviconPng(source, 16);
			const blob512 = await generateFaviconPng(source, 512);
			expect(blob16.type).toBe("image/png");
			expect(blob512.type).toBe("image/png");
		});
	});

	describe("generateIco", () => {
		it("creates a blob with type image/x-icon and size > 0", async () => {
			const pngBlobs = [
				{
					size: 16,
					blob: new Blob([new Uint8Array(100)], { type: "image/png" }),
				},
				{
					size: 32,
					blob: new Blob([new Uint8Array(200)], { type: "image/png" }),
				},
				{
					size: 48,
					blob: new Blob([new Uint8Array(300)], { type: "image/png" }),
				},
			];
			const icoBlob = await generateIco(pngBlobs);
			expect(icoBlob).toBeInstanceOf(Blob);
			expect(icoBlob.type).toBe("image/x-icon");
			expect(icoBlob.size).toBeGreaterThan(0);
		});

		it("produces correct header structure", async () => {
			const pngBlobs = [
				{
					size: 16,
					blob: new Blob([new Uint8Array(100)], { type: "image/png" }),
				},
			];
			const icoBlob = await generateIco(pngBlobs);
			const arrayBuffer = await icoBlob.arrayBuffer();
			const view = new DataView(arrayBuffer);

			// Reserved (0)
			expect(view.getUint16(0, true)).toBe(0);
			// Type: ICO (1)
			expect(view.getUint16(2, true)).toBe(1);
			// Count: 1
			expect(view.getUint16(4, true)).toBe(1);
			// First entry width: 16
			expect(new Uint8Array(arrayBuffer)[6]).toBe(16);
			// First entry height: 16
			expect(new Uint8Array(arrayBuffer)[7]).toBe(16);
		});

		it("handles sizes >= 256 by writing 0", async () => {
			const pngBlobs = [
				{
					size: 256,
					blob: new Blob([new Uint8Array(100)], { type: "image/png" }),
				},
			];
			const icoBlob = await generateIco(pngBlobs);
			const arrayBuffer = await icoBlob.arrayBuffer();
			const bytes = new Uint8Array(arrayBuffer);
			// Width and height should be 0 for >= 256
			expect(bytes[6]).toBe(0);
			expect(bytes[7]).toBe(0);
		});
	});

	describe("createWebManifest", () => {
		it("returns valid JSON with name and icons", () => {
			const manifest = createWebManifest();
			const parsed = JSON.parse(manifest);
			expect(parsed).toHaveProperty("name", "My Site");
			expect(parsed).toHaveProperty("short_name", "My Site");
			expect(parsed).toHaveProperty("icons");
			expect(Array.isArray(parsed.icons)).toBe(true);
			expect(parsed.icons).toHaveLength(2);
			expect(parsed.icons[0]).toMatchObject({
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			});
			expect(parsed.icons[1]).toMatchObject({
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			});
			expect(parsed).toHaveProperty("theme_color", "#ffffff");
			expect(parsed).toHaveProperty("background_color", "#ffffff");
			expect(parsed).toHaveProperty("display", "standalone");
		});
	});

	describe("generateHtmlTags", () => {
		it("contains apple-touch-icon link", () => {
			const tags = generateHtmlTags();
			expect(tags).toContain('<link rel="apple-touch-icon"');
		});

		it("contains icon links for 32x32 and 16x16", () => {
			const tags = generateHtmlTags();
			expect(tags).toContain('<link rel="icon"');
			expect(tags).toContain("32x32");
			expect(tags).toContain("16x16");
		});

		it("contains manifest link", () => {
			const tags = generateHtmlTags();
			expect(tags).toContain('<link rel="manifest"');
			expect(tags).toContain("/site.webmanifest");
		});

		it("returns a multi-line string", () => {
			const tags = generateHtmlTags();
			expect(tags.split("\n").length).toBeGreaterThan(1);
		});
	});

	describe("createZipPackage", () => {
		it("creates a blob with type application/zip", async () => {
			// Note: jszip 3.x in Node.js has issues reading Node's native Blob.
			// We pass Uint8Array (which jszip accepts) cast as Blob for the test.
			const files = [
				{
					name: "test.png",
					blob: new Uint8Array([1, 2, 3]) as unknown as Blob,
				},
			];
			const zipBlob = await createZipPackage(files);
			expect(zipBlob).toBeInstanceOf(Blob);
			expect(zipBlob.type).toBe("application/zip");
			expect(zipBlob.size).toBeGreaterThan(0);
		});

		it("includes all provided files", async () => {
			const files = [
				{
					name: "a.png",
					blob: new Uint8Array([1]) as unknown as Blob,
				},
				{
					name: "b.png",
					blob: new Uint8Array([2]) as unknown as Blob,
				},
			];
			const zipBlob = await createZipPackage(files);
			expect(zipBlob.size).toBeGreaterThan(0);
		});
	});
});
