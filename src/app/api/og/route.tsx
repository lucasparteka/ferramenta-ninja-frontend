import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title") ?? "Ferramentas Online Gratuitas";

	return new ImageResponse(
		<div
			style={{
				width: "1200px",
				height: "630px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				backgroundColor: "#0f172a",
				padding: "64px",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						"radial-gradient(ellipse at top left, rgba(124,58,237,0.25) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(56,189,248,0.15) 0%, transparent 60%)",
				}}
			/>

			<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
				<div
					style={{
						width: "40px",
						height: "40px",
						backgroundColor: "#7c3aed",
						borderRadius: "10px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700 }}>
						N
					</div>
				</div>
				<div style={{ color: "#94a3b8", fontSize: "20px", fontWeight: 500 }}>
					Ferramenta Ninja
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<div
					style={{
						color: "#ffffff",
						fontSize: title.length > 40 ? "48px" : "60px",
						fontWeight: 700,
						lineHeight: 1.1,
						letterSpacing: "-0.02em",
					}}
				>
					{title}
				</div>
				<div style={{ color: "#38bdf8", fontSize: "22px", fontWeight: 500 }}>
					Gratuito · Sem cadastro · No navegador
				</div>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div style={{ color: "#475569", fontSize: "18px" }}>
					ferramenta.ninja
				</div>
				<div
					style={{
						backgroundColor: "rgba(124,58,237,0.2)",
						border: "1px solid rgba(124,58,237,0.4)",
						borderRadius: "8px",
						padding: "8px 20px",
						color: "#a78bfa",
						fontSize: "16px",
						fontWeight: 500,
					}}
				>
					Acessar ferramenta
				</div>
			</div>
		</div>,
		{ width: 1200, height: 630 },
	);
}
