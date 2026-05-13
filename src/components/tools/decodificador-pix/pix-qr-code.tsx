"use client";

import { useEffect, useState } from "react";
import { generateQRCode } from "@/lib/qrcode/generate";
import { cn } from "@/lib/utils";

export function PixQrCode({
	code,
	valid,
	className,
}: {
	code: string;
	valid: boolean;
	className?: string;
}) {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!code || !valid) {
			setDataUrl(null);
			return;
		}
		setLoading(true);
		generateQRCode({
			text: code,
			size: 180,
			errorCorrectionLevel: "M",
		})
			.then((url) => {
				if (!cancelled) setDataUrl(url);
			})
			.catch(() => {
				if (!cancelled) setDataUrl(null);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [code, valid]);

	if (!code) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground",
					className,
				)}
			>
				<QrPlaceholderIcon className="h-10 w-10 opacity-40" />
				<p className="text-xs">Cole um código PIX para visualizar o QR Code</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div
				className={cn(
					"flex items-center justify-center py-8 text-xs text-muted-foreground",
					className,
				)}
			>
				Gerando...
			</div>
		);
	}

	if (!dataUrl || !valid) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground",
					className,
				)}
			>
				<QrPlaceholderIcon className="h-10 w-10 opacity-40" />
				<p className="text-xs">
					{valid
						? "Erro ao gerar QR Code"
						: "Código inválido — QR Code não gerado"}
				</p>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col items-center gap-2 py-4", className)}>
			<img
				src={dataUrl}
				alt="QR Code PIX"
				className="rounded-md border border-border bg-white"
				width={180}
				height={180}
			/>
			<p className="text-[10px] text-muted-foreground">
				QR Code gerado a partir do código
			</p>
		</div>
	);
}

function QrPlaceholderIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			viewBox="0 0 24 24"
		>
			<title>QR Code placeholder</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
			/>
		</svg>
	);
}
