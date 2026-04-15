export function formatDisplayUrl(url: string) {
	if (!url) return "";

	try {
		const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);

		const hostname = parsed.hostname.replace("www.", "");
		const path = parsed.pathname.split("/").filter(Boolean).join(" › ");

		return path ? `${hostname} › ${path}` : hostname;
	} catch {
		return url;
	}
}

export function getDomain(url: string) {
	try {
		const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
		return parsed.hostname;
	} catch {
		return "";
	}
}
