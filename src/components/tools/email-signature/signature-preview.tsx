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
				className={`rounded-lg border border-border p-6 ${
					darkBg ? "bg-neutral-900" : "bg-white"
				}`}
			>
				<div ref={ref} className="inline-block">
					<SignatureRenderer {...data} />
				</div>
			</div>
		);
	},
);
