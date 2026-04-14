"use client";

import { Separator } from "@/components/ui/separator";
import { TextCleanerInput } from "./text-cleaner-input";
import { TextCleanerOptions } from "./text-cleaner-options";
import { TextCleanerResult } from "./text-cleaner-result";
import { useTextCleaner } from "./use-text-cleaner";

export function TextCleaner() {
	const { input, output, options, setInput, setOptions } = useTextCleaner();

	return (
		<div className="flex flex-col gap-6">
			<TextCleanerInput value={input} onChange={setInput} />

			<TextCleanerOptions options={options} onChange={setOptions} />

			{output && (
				<>
					<Separator />
					<TextCleanerResult output={output} />
				</>
			)}
		</div>
	);
}
