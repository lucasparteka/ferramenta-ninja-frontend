import { lora, playfair, roboto } from "@/lib/fonts/resume-fonts";

export default function CardapioOnlineLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`${lora.variable} ${playfair.variable} ${roboto.variable}`}>
			{children}
		</div>
	);
}
