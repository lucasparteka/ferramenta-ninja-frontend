import {
	FIRST_NAMES,
	LAST_NAMES,
	CITIES,
	STREET_PREFIXES,
	STREET_NAMES,
	PRODUCT_CATEGORIES,
	PRODUCT_ADJECTIVES,
	PRODUCT_TYPES,
	ROLES,
	EMAIL_DOMAINS,
	STATUS_MESSAGES,
} from "./names";

export type MockDataType =
	| "user"
	| "product"
	| "api-success"
	| "api-error"
	| "pagination"
	| "edge-cases";

export type MockUser = {
	id: number;
	name: string;
	email: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: string;
	};
	roles: string[];
	createdAt: string;
};

export type MockProduct = {
	id: number;
	name: string;
	price: number;
	stock: number;
	category: string;
	sku: string;
};

function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
	const shuffled = [...arr].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, n);
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
	const val = Math.random() * (max - min) + min;
	return Number(val.toFixed(decimals));
}

function randomDate(start: Date, end: Date): string {
	const date = new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
	return date.toISOString();
}

function randomPastDate(maxDaysAgo: number): string {
	const now = new Date();
	const past = new Date(now.getTime() - Math.random() * maxDaysAgo * 86400000);
	return past.toISOString();
}

export function generateUsers(count: number): MockUser[] {
	const usedIds = new Set<number>();
	return Array.from({ length: count }, (_, i) => {
		let id: number;
		do {
			id = i + 1;
		} while (usedIds.has(id));
		usedIds.add(id);

		const firstName = pick(FIRST_NAMES);
		const lastName = pick(LAST_NAMES);
		const name = `${firstName} ${lastName}`;
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(EMAIL_DOMAINS)}`;
		const city = pick(CITIES);
		const street = `${pick(STREET_PREFIXES)} ${pick(STREET_NAMES)}, ${randomInt(1, 9999)}`;

		return {
			id,
			name,
			email,
			address: {
				street,
				city: city.name,
				state: city.state,
				zip: `${randomInt(10000, 99999)}-${randomInt(100, 999)}`,
			},
			roles: pickN(ROLES, randomInt(1, 3)),
			createdAt: randomPastDate(730),
		};
	});
}

export function generateProducts(count: number): MockProduct[] {
	return Array.from({ length: count }, (_, i) => {
		const category = pick(PRODUCT_CATEGORIES);
		const types = PRODUCT_TYPES[category];
		const typeName = pick(types);
		const adjective = pick(PRODUCT_ADJECTIVES);
		const name = `${typeName} ${adjective}`;
		const randomNum = Math.random().toString(36).substring(2, 8).toUpperCase();
		const catPrefix = category.substring(0, 3).toUpperCase();

		return {
			id: i + 1,
			name,
			price: randomFloat(1.99, 9999.99),
			stock: randomInt(0, 5000),
			category,
			sku: `${catPrefix}-${randomNum}`,
		};
	});
}

export function generateApiSuccessResponse(data: unknown) {
	return {
		status: "success",
		code: 200,
		message: pick(STATUS_MESSAGES.success),
		data,
		timestamp: new Date().toISOString(),
		requestId: `req_${Math.random().toString(36).substring(2, 15)}`,
	};
}

export function generateApiErrorResponse() {
	const errors = STATUS_MESSAGES.error;
	const errorCodes = [400, 401, 403, 404, 409, 422, 429, 500];
	const code = pick(errorCodes);

	return {
		status: "error",
		code,
		error: pick(errors),
		message: pick(errors),
		timestamp: new Date().toISOString(),
		requestId: `req_${Math.random().toString(36).substring(2, 15)}`,
		path: `/api/${pick(["users", "products", "orders", "auth", "payments"])}`,
	};
}

export function generatePaginationResponse<T>(
	data: T[],
	page: number,
	limit: number,
) {
	const total = 1000;
	const totalPages = Math.ceil(total / limit);

	return {
		page,
		limit,
		total,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
		data: data.slice(0, limit),
	};
}

export function generateEdgeCases() {
	const longString = "a".repeat(10000);

	return {
		nested: {
			level1: {
				level2: {
					level3: {
						level4: {
							value: "deeply nested",
						},
					},
				},
			},
		},
		specialChars: {
			acentos: "áéíóú ç âêîôû àèìòù äëïöü",
			emoji: "🚀 ✅ ❤️ 🎉 👍 🔥 🎸 🏆",
			html: "<script>alert('xss')</script> & \"'<>",
			unicode: "日本語 中文 Русский العربية",
		},
		extremes: {
			maxSafeInteger: Number.MAX_SAFE_INTEGER,
			minSafeInteger: Number.MIN_SAFE_INTEGER,
			negative: -42.5,
			zero: 0,
			scientific: 1.5e12,
			decimalPrecision: 0.0000001,
			infinity: Infinity,
		},
		emptyValues: {
			nullValue: null,
			emptyString: "",
			emptyArray: [],
			emptyObject: {},
		},
		dates: {
			iso8601: new Date().toISOString(),
			brFormat: new Date().toLocaleDateString("pt-BR"),
			timestamp: Date.now(),
			unixSeconds: Math.floor(Date.now() / 1000),
		},
		arrays: {
			simple: [1, 2, 3, 4, 5],
			mixed: [1, "texto", true, null, { key: "value" }, [1, 2, 3]],
			large: Array.from({ length: 1000 }, (_, i) => i),
		},
		longText: longString,
		booleans: [true, false, true, false, true],
		ids: {
			uuid: "550e8400-e29b-41d4-a716-446655440000",
			shortId: "abc123",
			numericId: 42,
		},
	};
}

function flattenKeys(
	obj: unknown,
	prefix = "",
): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	if (obj === null || obj === undefined) {
		result[prefix] = obj;
		return result;
	}

	if (typeof obj !== "object" || Array.isArray(obj)) {
		result[prefix] = obj;
		return result;
	}

	for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (value !== null && typeof value === "object" && !Array.isArray(value)) {
			Object.assign(result, flattenKeys(value, fullKey));
		} else {
			result[fullKey] = value;
		}
	}

	return result;
}

export function convertToCSV(data: Record<string, unknown>[]): string {
	if (data.length === 0) return "";

	const flattened = data.map((row) => flattenKeys(row));
	const headers = [...new Set(flattened.flatMap((row) => Object.keys(row)))];

	const csvRows = [
		headers.join(","),
		...flattened.map((row) => {
			return headers
				.map((header) => {
					const value = row[header];
					if (value === null || value === undefined) return "";
					const str = String(value);
					if (
						str.includes(",") ||
						str.includes('"') ||
						str.includes("\n")
					) {
						return `"${str.replace(/"/g, '""')}"`;
					}
					return str;
				})
				.join(",");
		}),
	];

	return csvRows.join("\n");
}

export function downloadFile(
	content: string,
	filename: string,
	mimeType: string,
) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
