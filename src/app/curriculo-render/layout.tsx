import {
	barlow,
	dmSans,
	lora,
	playfair,
	plusJakarta,
	roboto,
} from "@/lib/fonts/resume-fonts";

export default function CurriculoRenderLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className={`${lora.variable} ${dmSans.variable} ${plusJakarta.variable} ${barlow.variable} ${playfair.variable} ${roboto.variable}`}
		>
			{children}
		</div>
	);
}
