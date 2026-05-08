"use client";

import { forwardRef } from "react";
import { SignatureRenderer } from "./renderer";
import type { EmailSignatureData } from "./types";

interface Props {
	data: EmailSignatureData;
	darkBg: boolean;
}

export const SignaturePreview = forwardRef<HTMLDivElement, Props>(
	function SignaturePreview({ data, darkBg }, ref) {
		return (
			<div
				className={`rounded-md border border-border p-5 ${
					darkBg ? "bg-card" : "bg-background"
				}`}
			>
				<div ref={ref} className="inline-block">
					<SignatureRenderer {...data} />
				</div>
			</div>
		);
	},
);
