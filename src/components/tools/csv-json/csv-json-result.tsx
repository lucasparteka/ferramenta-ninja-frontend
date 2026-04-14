"use client";

type Props = {
	output: string;
	errors: string[];
};

export function CsvJsonResult({ output, errors }: Props) {
	return (
		<div className="flex flex-col gap-4">
			{errors.length > 0 && (
				<div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
					{errors.map((err) => (
						<div key={err}>{err}</div>
					))}
				</div>
			)}
			<div className="rounded-md border bg-background p-4">
				<pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
			</div>
		</div>
	);
}
