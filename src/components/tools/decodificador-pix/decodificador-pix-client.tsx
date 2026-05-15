"use client";

import {
	ClipboardPaste,
	Copy,
	RefreshCw,
	Search,
	Trash2,
	Wand2,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { LayoutD } from "@/components/shared/layout-d";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	decodePixBrCode,
	fixCrc,
	type PixDecoded,
	validateCrc,
} from "@/lib/pix/decode";
import { addToHistory, type HistoryItem, PixHistory } from "./pix-history";
import { PixInfoPanel } from "./pix-info-panel";
import { PixQrCode } from "./pix-qr-code";
import { PixStructurePanel } from "./pix-structure-panel";

export function DecodificadorPixClient() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<PixDecoded | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [pasted, setPasted] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const decode = useCallback((text: string) => {
		const clean = text.trim();
		if (!clean) {
			setErrorMessage("Por favor, insira um código PIX");
			setResult(null);
			return;
		}
		try {
			const decoded = decodePixBrCode(clean);
			setResult(decoded);
			setErrorMessage(
				decoded.errors.length > 0 ? decoded.errors.join("\n") : null,
			);
			if (decoded.isValid) {
				addToHistory({
					emv: clean,
					beneficiario: decoded.pixInfo.merchantName || "-",
					valorOriginal: decoded.pixInfo.amount
						? Number.parseFloat(decoded.pixInfo.amount).toLocaleString(
								"pt-BR",
								{
									style: "currency",
									currency: "BRL",
								},
							)
						: undefined,
					timestamp: Date.now(),
				});
			}
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Erro ao decodificar",
			);
			setResult(null);
		}
	}, []);

	const handleDecode = useCallback(() => {
		decode(input);
	}, [input, decode]);

	const handleClear = useCallback(() => {
		setInput("");
		setResult(null);
		setErrorMessage(null);
		setCopied(false);
		setPasted(false);
		inputRef.current?.focus();
	}, []);

	const handleCopy = useCallback(async () => {
		if (!input.trim()) return;
		try {
			await navigator.clipboard.writeText(input);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setErrorMessage("Não foi possível copiar");
		}
	}, [input]);

	const handlePaste = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (!text.trim()) return;
			setPasted(true);
			setTimeout(() => setPasted(false), 2000);
			setInput(text);
			setErrorMessage(null);
			decode(text);
		} catch {
			setErrorMessage("Não foi possível acessar a área de transferência");
		}
	}, [decode]);

	const handleFixCrc = useCallback(() => {
		if (!input.trim()) return;
		try {
			const fixed = fixCrc(input.trim());
			setInput(fixed);
			setErrorMessage(null);
			decode(fixed);
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Erro ao corrigir CRC",
			);
		}
	}, [input, decode]);

	const handlePasteEvent = useCallback(
		(e: React.ClipboardEvent<HTMLTextAreaElement>) => {
			e.preventDefault();
			const text = e.clipboardData.getData("text");
			if (!text.trim()) return;
			setErrorMessage(null);
			setInput(text);
			decode(text);
		},
		[decode],
	);

	const handleHistorySelect = useCallback(
		(item: HistoryItem) => {
			setInput(item.emv);
			setErrorMessage(null);
			setResult(null);
			decode(item.emv);
		},
		[decode],
	);

	const crcIsInvalid = input.trim() && !validateCrc(input.trim());

	const mainContent = (
		<div className="flex flex-col gap-4 p-4">
			<div className="space-y-3">
				<Textarea
					ref={inputRef}
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						if (result) setResult(null);
						if (errorMessage) setErrorMessage(null);
					}}
					onPaste={handlePasteEvent}
					placeholder="Cole aqui o código PIX copiado do QR Code..."
					rows={4}
					className="min-h-25 font-mono text-xs"
				/>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={handlePaste}
						className="gap-1.5 text-xs"
					>
						{pasted ? (
							<RefreshCw className="h-3.5 w-3.5" />
						) : (
							<ClipboardPaste className="h-3.5 w-3.5" />
						)}
						{pasted ? "Colado" : "Colar"}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleCopy}
						disabled={!input.trim()}
						className="gap-1.5 text-xs"
					>
						{copied ? (
							<RefreshCw className="h-3.5 w-3.5" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}
						{copied ? "Copiado" : "Copiar"}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClear}
						disabled={!input && !result}
						className="gap-1.5 text-xs"
					>
						<Trash2 className="h-3.5 w-3.5" />
						Limpar
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<Button
					onClick={handleDecode}
					disabled={!input.trim()}
					className="gap-1.5 text-xs"
				>
					<Search className="h-3.5 w-3.5" />
					Decodificar
				</Button>
				<Button
					variant="secondary"
					onClick={handleFixCrc}
					disabled={!input.trim() || !crcIsInvalid}
					className="gap-1.5 text-xs"
				>
					<Wand2 className="h-3.5 w-3.5" />
					Corrigir CRC
				</Button>
			</div>

			{errorMessage && (
				<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
					<p className="whitespace-pre-wrap text-xs text-destructive">
						{errorMessage}
					</p>
				</div>
			)}

			{result && (
				<div className="space-y-4">
					<div className="rounded-md border border-border overflow-hidden bg-card">
						<div className="border-b border-border bg-muted/55 px-4 py-1.75">
							<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
								Informações do PIX
							</h3>
						</div>
						<PixInfoPanel pixInfo={result.pixInfo} />
					</div>

					<div className="rounded-md border border-border overflow-hidden bg-card min-h-75">
						<PixStructurePanel fields={result.fields} raw={result.raw} />
					</div>
				</div>
			)}
		</div>
	);

	const sidebar = (
		<div className="flex flex-col h-full">
			<SidebarSection title="QR Code" hint="Visualização">
				<PixQrCode code={input} valid={result?.isValid ?? false} />
			</SidebarSection>
			<div className="flex-1 overflow-auto">
				<PixHistory
					onSelect={handleHistorySelect}
					onClear={() => {
						setInput("");
						setResult(null);
						setErrorMessage(null);
					}}
				/>
			</div>
		</div>
	);

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Decodificador PIX"
					badge={result ? (result.isValid ? "VÁLIDO" : "INVÁLIDO") : undefined}
					actions={
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={handleClear}
							aria-label="Limpar"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					}
				/>
			}
			sidebar={sidebar}
		>
			{mainContent}
			{result && (
				<StatusBar
					items={[
						{
							label: "Campos",
							value: String(result.fields.length),
							mono: true,
						},
						{
							label: "CRC",
							value: result.crcProvided || "N/A",
							mono: true,
							variant:
								result.crcProvided === result.crcCalculated
									? "success"
									: "danger",
						},
						{
							label: "Tipo",
							value:
								result.pixInfo.type === "dynamic" ? "Dinâmico" : "Estático",
						},
					]}
				/>
			)}
		</LayoutD>
	);
}
