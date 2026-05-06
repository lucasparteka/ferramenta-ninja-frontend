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
		<>
			<style>{`
				body {
					background: white !important;
					color: black !important;
				}
				body > header,
				body > footer,
				[data-sonner-toaster] {
					display: none !important;
				}
			`}</style>
			<div
				className={`${lora.variable} ${dmSans.variable} ${plusJakarta.variable} ${barlow.variable} ${playfair.variable} ${roboto.variable}`}
			>
				{children}
			</div>
		</>
	);
}
