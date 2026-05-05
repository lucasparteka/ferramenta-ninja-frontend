export function generateWhatsAppLink(phone: string, message?: string): string {
	const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
	return `https://wa.me/${phone}${encoded}`;
}

export function generateWhatsAppLinkCleanUrl(phone: string, message?: string): string {
	const url = generateWhatsAppLink(phone, message);
	return url;
}
