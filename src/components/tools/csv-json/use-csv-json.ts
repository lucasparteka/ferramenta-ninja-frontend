"use client";

import { useEffect, useMemo, useState } from "react";
import { parseCsv } from "@/lib/csv/parse-csv";
import { stringifyCsv } from "@/lib/csv/stringify-csv";
import { validateCsv } from "@/lib/csv/validate-csv";
import { flattenObject } from "@/lib/json/flatten-object";

type Mode = "csv-to-json" | "json-to-csv";

function detectMode(text: string): Mode | null {
	if (!text.trim()) return null;

	try {
		JSON.parse(text);
		return "json-to-csv";
	} catch {
		return "csv-to-json";
	}
}

export function useCsvJson() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [errors, setErrors] = useState<string[]>([]);
	const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
	const [mode, setMode] = useState<Mode | null>(null);

	const detectedMode = useMemo(() => detectMode(input), [input]);

	useEffect(() => {
		if (!input.trim()) {
			setOutput("");
			setErrors([]);
			setTableData([]);
			setMode(null);
			return;
		}

		try {
			if (detectedMode === "csv-to-json") {
				setMode("csv-to-json");

				const validation = validateCsv(input);
				setErrors(validation.errors);

				const json = parseCsv(input);
				setTableData(json);
				setOutput(JSON.stringify(json, null, 2));
			}
			if (detectedMode === "json-to-csv") {
				setMode("json-to-csv");

				const parsed = JSON.parse(input);

				let normalized: Record<string, any>[];

				if (Array.isArray(parsed)) {
					normalized = parsed;
				} else if (typeof parsed === "object" && parsed !== null) {
					normalized = [parsed];
				} else {
					throw new Error("JSON inválido para conversão");
				}

				const flattened = normalized.map((item) => flattenObject(item));

				setTableData(flattened);

				const csv = stringifyCsv(flattened);
				setOutput(csv);
				setErrors([]);
			}
		} catch (error) {
			if (error instanceof Error) {
				setErrors([error.message]);
			} else {
				setErrors(["Não foi possível converter automaticamente"]);
			}
			setOutput("");
			setTableData([]);
		}
	}, [input, detectedMode]);

	const clear = () => {
		setInput("");
	};

	return {
		input,
		output,
		errors,
		tableData,
		mode,
		setInput,
		clear,
	};
}
