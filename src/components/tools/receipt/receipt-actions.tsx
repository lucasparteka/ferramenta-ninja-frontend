"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReceiptFormValues } from "./receipt-client";

type ReceiptActionsProps = {
	values: ReceiptFormValues | null;
	isExporting: boolean;
	onExport: () => void;
};

export function ReceiptActions({
	values,
	isExporting,
	onExport,
}: ReceiptActionsProps) {
	return (
		<div className="flex justify-end pt-2">
			<Button onClick={onExport} disabled={!values || isExporting}>
				<FileDown className="size-4" />
				{isExporting ? "Gerando PDF..." : "Baixar PDF"}
			</Button>
		</div>
	);
}
