"use client";

type Props = {
	data: Record<string, unknown>[];
};

export function CsvJsonTable({ data }: Props) {
	if (!data.length) return null;

	const headers = Object.keys(data[0]);

	return (
		<div className="overflow-x-auto rounded-md border">
			<table className="w-full text-sm">
				<thead className="bg-muted">
					<tr>
						{headers.map((header) => (
							<th key={header} className="px-3 py-2 text-left font-medium">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.slice(0, 50).map((row, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Only way to have a key for this map
						<tr key={i} className="border-t">
							{headers.map((header) => (
								<td key={header} className="px-3 py-2">
									{String(row[header] ?? "")}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
