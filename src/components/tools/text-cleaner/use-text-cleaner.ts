"use client";

import { useEffect, useState } from "react";

export type TextCleanerOptions = {
	removeExtraSpaces: boolean;
	removeLineBreaks: boolean;
	removeInvisible: boolean;
	trimLines: boolean;
};

const defaultOptions: TextCleanerOptions = {
	removeExtraSpaces: true,
	removeLineBreaks: false,
	removeInvisible: true,
	trimLines: true,
};

function cleanText(text: string, options: TextCleanerOptions) {
	let result = text;

	if (options.removeInvisible) {
		result = result.replace(/[\u200B-\u200D\uFEFF]/g, "");
	}

	if (options.trimLines) {
		result = result
			.split("\n")
			.map((line) => line.trim())
			.join("\n");
	}

	if (options.removeExtraSpaces) {
		result = result.replace(/\s+/g, " ");
	}

	if (options.removeLineBreaks) {
		result = result.replace(/\n/g, " ");
	}

	return result;
}

export function useTextCleaner(initialOptions?: Partial<TextCleanerOptions>) {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [options, setOptions] = useState<TextCleanerOptions>({
		...defaultOptions,
		...initialOptions,
	});

	useEffect(() => {
		if (!input) {
			setOutput("");
			return;
		}

		const cleaned = cleanText(input, options);
		setOutput(cleaned);
	}, [input, options]);

	function detectIssues(text: string) {
		return {
			fromWord: /\u00A0/.test(text),
			hasInvisible: /[\u200B-\u200D\uFEFF]/.test(text),
			hasManyLineBreaks: (text.match(/\n/g) || []).length > 5,
		};
	}
	const issues = detectIssues(input);

	return {
		input,
		output,
		options,
		issues,
		setInput,
		setOptions,
	};
}
