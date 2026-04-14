"use client";

import DiffMatchPatch from "diff-match-patch";
import { useCallback, useEffect, useState } from "react";

type DiffOptions = {
	ignoreCase: boolean;
	ignoreWhitespace: boolean;
	showOnlyDifferences: boolean;
	wordLevelDiff: boolean;
};

type DiffTuple = [-1 | 0 | 1, string];

const STORAGE_KEY = "text-diff-inputs";

const defaultOptions: DiffOptions = {
	ignoreCase: false,
	ignoreWhitespace: false,
	showOnlyDifferences: false,
	wordLevelDiff: false,
};

function normalizeText(text: string, options: DiffOptions): string {
	let result = text;
	if (options.ignoreCase) result = result.toLowerCase();
	if (options.ignoreWhitespace) result = result.replace(/\s+/g, " ").trim();
	return result;
}

function computeWordDiff(left: string, right: string): DiffTuple[] {
	const dmp = new DiffMatchPatch();
	const wordsLeft = left.split(/(\s+)/);
	const wordsRight = right.split(/(\s+)/);
	const diff = dmp.diff_main(wordsLeft.join("\x00"), wordsRight.join("\x00"));
	dmp.diff_cleanupSemantic(diff);
	const result: DiffTuple[] = [];
	for (const [type, text] of diff) {
		result.push([type as -1 | 0 | 1, text.replaceAll("\x00", "")]);
	}
	return result;
}

function computeCharDiff(left: string, right: string): DiffTuple[] {
	const dmp = new DiffMatchPatch();
	const diff = dmp.diff_main(left, right);
	dmp.diff_cleanupSemantic(diff);
	return diff as DiffTuple[];
}

export function useDiff() {
	const [leftText, setLeftText] = useState("");
	const [rightText, setRightText] = useState("");
	const [diffResult, setDiffResult] = useState<DiffTuple[]>([]);
	const [hasCompared, setHasCompared] = useState(false);
	const [options, setOptions] = useState<DiffOptions>(defaultOptions);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (parsed.left !== undefined) setLeftText(parsed.left);
				if (parsed.right !== undefined) setRightText(parsed.right);
			}
		} catch {}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ left: leftText, right: rightText }),
			);
		} catch {}
	}, [leftText, rightText]);

	const computeDiff = useCallback(() => {
		const normalizedLeft = normalizeText(leftText, options);
		const normalizedRight = normalizeText(rightText, options);

		const result = options.wordLevelDiff
			? computeWordDiff(normalizedLeft, normalizedRight)
			: computeCharDiff(normalizedLeft, normalizedRight);

		setDiffResult(result);
		setHasCompared(true);
	}, [leftText, rightText, options]);

	const clearAll = useCallback(() => {
		setLeftText("");
		setRightText("");
		setDiffResult([]);
		setHasCompared(false);
	}, []);

	const swapTexts = useCallback(() => {
		setLeftText(rightText);
		setRightText(leftText);
		setDiffResult([]);
		setHasCompared(false);
	}, [leftText, rightText]);

	const copyResult = useCallback(() => {
		const plain = diffResult.map(([, text]) => text).join("");
		navigator.clipboard.writeText(plain);
	}, [diffResult]);

	return {
		leftText,
		rightText,
		diffResult,
		hasCompared,
		options,
		setLeftText,
		setRightText,
		setOptions,
		computeDiff,
		clearAll,
		swapTexts,
		copyResult,
	};
}
