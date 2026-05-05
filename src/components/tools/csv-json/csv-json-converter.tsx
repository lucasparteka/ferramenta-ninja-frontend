"use client";

import { Trash } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { CsvJsonTable } from "@/components/tools/csv-json/csv-json-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CsvJsonInput } from "./csv-json-input";
import { CsvJsonResult } from "./csv-json-result";
import { useCsvJson } from "./use-csv-json";

export function CsvJsonConverter() {
	const { input, output, errors, tableData, setInput, clear, mode } =
		useCsvJson();

	return (
		<div className="flex flex-col gap-6">
			<CsvJsonInput value={input} onChange={setInput} />
			<Button
				variant="secondary"
				disabled={!output}
				onClick={clear}
				className="ml-auto flex"
			>
				<Trash />
				Limpar
			</Button>
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
			{!!output && (
				<CopyButton
					text={output}
					label="Copiar resultado"
					className="ml-auto flex"
				/>
			)}
		</div>
	);
}
