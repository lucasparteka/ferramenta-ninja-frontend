"use client";

import { CsvJsonTable } from "@/components/tools/csv-json/csv-json-table";
import { Separator } from "@/components/ui/separator";
import { CsvJsonControls } from "./csv-json-controls";
import { CsvJsonInput } from "./csv-json-input";
import { CsvJsonResult } from "./csv-json-result";
import { useCsvJson } from "./use-csv-json";

export function CsvJsonConverter() {
	const { input, output, errors, tableData, setInput, clear, mode } =
		useCsvJson();

	return (
		<div className="flex flex-col gap-6">
			<CsvJsonInput value={input} onChange={setInput} />
			<CsvJsonControls onClear={clear} output={output} hasResult={!!output} />
			{mode && (
				<div className="text-sm text-muted-foreground">
					Detectado: <strong>{mode === "csv-to-json" ? "CSV" : "JSON"}</strong>{" "}
					→ Convertendo para{" "}
					<strong>{mode === "csv-to-json" ? "JSON" : "CSV"}</strong>
				</div>
			)}
			{output && (
				<>
					<Separator />
					<CsvJsonResult output={output} errors={errors} />

					{mode === "json-to-csv" && tableData.length > 0 && (
						<CsvJsonTable data={tableData} />
					)}
				</>
			)}
		</div>
	);
}
