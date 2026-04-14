"use client";

import { useEffect, useState } from "react";

type Options = {
	removeExtraSpaces: boolean;
	removeLineBreaks: boolean;
	removeInvisible: boolean;
	trimLines: boolean;
};

const defaultOptions: Options = {
	removeExtraSpaces: true,
	removeLineBreaks: false,
	removeInvisible: true,
	trimLines: true,
};

function cleanText(text: string, options: Options) {
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

export function useTextCleaner() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [options, setOptions] = useState(defaultOptions);

	useEffect(() => {
		if (!input) {
			setOutput("");
			return;
		}

		const cleaned = cleanText(input, options);
		setOutput(cleaned);
	}, [input, options]);

	return {
		input,
		output,
		options,
		setInput,
		setOptions,
	};
}
