export function getTitleStatus(length: number) {
	if (length === 0) return "empty";
	if (length < 30) return "short";
	if (length <= 60) return "good";
	return "long";
}

export function getDescriptionStatus(length: number) {
	if (length === 0) return "empty";
	if (length < 120) return "short";
	if (length <= 160) return "good";
	return "long";
}

export function getStatusColor(status: string) {
	switch (status) {
		case "good":
			return "text-green-600";
		case "short":
			return "text-yellow-600";
		case "long":
			return "text-red-600";
		default:
			return "text-muted-foreground";
	}
}
