import md5 from "md5";

export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

function webCryptoName(algo: HashAlgorithm): string {
	switch (algo) {
		case "sha1": return "SHA-1";
		case "sha256": return "SHA-256";
		case "sha512": return "SHA-512";
		default: throw new Error(`Not a Web Crypto algorithm: ${algo}`);
	}
}

export async function hashText(text: string, algo: HashAlgorithm): Promise<string> {
	if (algo === "md5") {
		return md5(text);
	}

	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest(webCryptoName(algo), data);
	return bufferToHex(hashBuffer);
}

export async function hashFile(file: File, algo: HashAlgorithm): Promise<string> {
	const buffer = await file.arrayBuffer();

	if (algo === "md5") {
		const text = new TextDecoder().decode(buffer);
		return md5(text);
	}

	const hashBuffer = await crypto.subtle.digest(webCryptoName(algo), buffer);
	return bufferToHex(hashBuffer);
}

export async function hmacText(text: string, algo: HashAlgorithm, key: string): Promise<string> {
	const encoder = new TextEncoder();
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		encoder.encode(key),
		{ name: "HMAC", hash: webCryptoName(algo === "md5" ? "sha256" : algo) },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(text));
	return bufferToHex(signature);
}

export async function hmacFile(file: File, algo: HashAlgorithm, key: string): Promise<string> {
	const buffer = await file.arrayBuffer();
	const encoder = new TextEncoder();
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		encoder.encode(key),
		{ name: "HMAC", hash: webCryptoName(algo === "md5" ? "sha256" : algo) },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign("HMAC", cryptoKey, buffer);
	return bufferToHex(signature);
}

function bufferToHex(buf: ArrayBuffer): string {
	const bytes = new Uint8Array(buf);
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const ALGORITHM_LABELS: Record<HashAlgorithm, string> = {
	md5: "MD5",
	sha1: "SHA-1",
	sha256: "SHA-256",
	sha512: "SHA-512",
};
