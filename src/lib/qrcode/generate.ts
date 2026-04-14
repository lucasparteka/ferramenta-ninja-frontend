import QRCode from "qrcode";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type QRCodeOptions = {
	text: string;
	size: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
};

export async function generateQRCode(options: QRCodeOptions): Promise<string> {
	return QRCode.toDataURL(options.text, {
		width: options.size,
		margin: 2,
		errorCorrectionLevel: options.errorCorrectionLevel,
		color: {
			dark: "#000000",
			light: "#ffffff",
		},
	});
}
