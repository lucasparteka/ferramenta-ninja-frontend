export function flattenObject(
	obj: Record<string, any>,
	prefix = "",
): Record<string, string> {
	const result: Record<string, string> = {};

	for (const key in obj) {
		const value = obj[key];
		const newKey = prefix ? `${prefix}.${key}` : key;

		if (Array.isArray(value)) {
			if (value.every((v) => typeof v !== "object")) {
				result[newKey] = value.join("|");
			} else {
				result[newKey] = JSON.stringify(value);
			}
		} else if (typeof value === "object" && value !== null) {
			Object.assign(result, flattenObject(value, newKey));
		} else {
			result[newKey] = String(value ?? "");
		}
	}

	return result;
}
