"use client";

import { Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HISTORY_KEY = "pix-decoder-history";

export type HistoryItem = {
	emv: string;
	beneficiario: string;
	expiracao?: string;
	valorOriginal?: string;
	devedorNome?: string;
	devedorCpfCnpj?: string;
	timestamp: number;
};

export function PixHistory({
	onSelect,
	onClear,
}: {
	onSelect: (item: HistoryItem) => void;
	onClear: () => void;
}) {
	const [items, setItems] = useState<HistoryItem[]>([]);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(HISTORY_KEY);
			if (raw) setItems(JSON.parse(raw));
		} catch {
			setItems([]);
		}
	}, []);

	const handleClear = useCallback(() => {
		setItems([]);
		try {
			localStorage.removeItem(HISTORY_KEY);
		} catch {}
		onClear();
		setConfirmOpen(false);
	}, [onClear]);

	if (items.length === 0) return null;

	return (
		<div>
			<div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
				<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					Histórico
				</h3>
				<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
					<AlertDialogTrigger
						render={
							<button
								type="button"
								className="rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
								title="Limpar histórico"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						}
					/>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Limpar Histórico</AlertDialogTitle>
							<AlertDialogDescription>
								Tem certeza que deseja limpar todo o histórico de consultas?
								Esta ação não pode ser desfeita.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleClear}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								Limpar
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<div className="divide-y divide-border">
				{items.map((item) => (
					<button
						key={item.emv}
						type="button"
						onClick={() => onSelect(item)}
						className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-muted/40"
					>
						<Search className="h-3 w-3 shrink-0 text-muted-foreground" />
						<div className="min-w-0 flex-1">
							<p className="truncate text-xs font-medium">
								{item.beneficiario || "Código PIX"}
							</p>
							{item.valorOriginal && (
								<p className="text-[10px] text-muted-foreground">
									{item.valorOriginal}
								</p>
							)}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

export function addToHistory(item: HistoryItem) {
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		const existing: HistoryItem[] = raw ? JSON.parse(raw) : [];
		if (existing.some((e) => e.emv === item.emv)) return;
		const next = [item, ...existing].slice(0, 10);
		localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
	} catch {}
}

export function updateHistoryItem(emv: string, updates: Partial<HistoryItem>) {
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		const existing: HistoryItem[] = raw ? JSON.parse(raw) : [];
		const idx = existing.findIndex((e) => e.emv === emv);
		if (idx === -1) return;
		existing[idx] = { ...existing[idx], ...updates };
		localStorage.setItem(HISTORY_KEY, JSON.stringify(existing));
	} catch {}
}
