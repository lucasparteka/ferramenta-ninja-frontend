export type RegexFlags = {
	g: boolean;
	i: boolean;
	m: boolean;
	s: boolean;
	u: boolean;
	y: boolean;
};

export const DEFAULT_FLAGS: RegexFlags = {
	g: true,
	i: false,
	m: false,
	s: false,
	u: false,
	y: false,
};

export type RegexMatch = {
	fullMatch: string;
	index: number;
	length: number;
	groups: Record<string, string>;
	captures: string[];
};

export type RegexResult = {
	valid: boolean;
	error?: string;
	matches: RegexMatch[];
	totalMatches: number;
	flags: string;
};

export type HighlightRange = {
	start: number;
	end: number;
	matchIndex: number;
};

export const FLAG_DESCRIPTIONS: Record<keyof RegexFlags, { label: string; description: string }> = {
	g: { label: "g", description: "global — todos os matches" },
	i: { label: "i", description: "insensível a maiúsculas" },
	m: { label: "m", description: "multilinha (^ e $ por linha)" },
	s: { label: "s", description: "dotAll (. inclui \\n)" },
	u: { label: "u", description: "unicode" },
	y: { label: "y", description: "sticky (ancoragem)" },
};

export const QUICK_REFERENCE = [
	{ token: "\\d", meaning: "Dígito (0–9)" },
	{ token: "\\D", meaning: "Não dígito" },
	{ token: "\\w", meaning: "Palavra (a-z, A-Z, 0-9, _)" },
	{ token: "\\W", meaning: "Não palavra" },
	{ token: "\\s", meaning: "Espaço, tab, newline" },
	{ token: "\\S", meaning: "Não espaço" },
	{ token: ".", meaning: "Qualquer caractere (exceto \\n)" },
	{ token: "^", meaning: "Início da string" },
	{ token: "$", meaning: "Fim da string" },
	{ token: "*", meaning: "0 ou mais vezes" },
	{ token: "+", meaning: "1 ou mais vezes" },
	{ token: "?", meaning: "0 ou 1 vez (opcional)" },
	{ token: "{n}", meaning: "Exatamente n vezes" },
	{ token: "{n,m}", meaning: "Entre n e m vezes" },
	{ token: "[abc]", meaning: "Qualquer de a, b, c" },
	{ token: "[^abc]", meaning: "Qualquer exceto a, b, c" },
	{ token: "(grp)", meaning: "Grupo capturante" },
	{ token: "(?:grp)", meaning: "Grupo não capturante" },
	{ token: "(?<n>grp)", meaning: "Grupo nomeado" },
	{ token: "a|b", meaning: "a OU b" },
] as const;

export function buildFlagsString(flags: RegexFlags): string {
	return (Object.keys(flags) as Array<keyof RegexFlags>)
		.filter((k) => flags[k])
		.join("");
}

const MAX_MATCHES = 100;

export function testRegex(
	pattern: string,
	flags: RegexFlags,
	testString: string,
): RegexResult {
	const flagStr = buildFlagsString(flags);

	if (!pattern) {
		return { valid: true, matches: [], totalMatches: 0, flags: flagStr };
	}

	try {
		const regex = new RegExp(pattern, flagStr);
		const matches: RegexMatch[] = [];

		if (flags.g || flags.y) {
			let match: RegExpExecArray | null;
			while (matches.length < MAX_MATCHES && (match = regex.exec(testString)) !== null) {
				matches.push({
					fullMatch: match[0],
					index: match.index,
					length: match[0].length,
					groups: match.groups ? { ...match.groups } : {},
					captures: match.slice(1).map((c) => c ?? ""),
				});
				if (match[0].length === 0) regex.lastIndex++;
			}
		} else {
			const match = regex.exec(testString);
			if (match) {
				matches.push({
					fullMatch: match[0],
					index: match.index,
					length: match[0].length,
					groups: match.groups ? { ...match.groups } : {},
					captures: match.slice(1).map((c) => c ?? ""),
				});
			}
		}

		return { valid: true, matches, totalMatches: matches.length, flags: flagStr };
	} catch (e) {
		const error = e instanceof Error ? e.message : "Expressão inválida";
		return { valid: false, error, matches: [], totalMatches: 0, flags: flagStr };
	}
}

export function getHighlightRanges(matches: RegexMatch[]): HighlightRange[] {
	return matches.map((m, i) => ({
		start: m.index,
		end: m.index + m.length,
		matchIndex: i,
	}));
}
