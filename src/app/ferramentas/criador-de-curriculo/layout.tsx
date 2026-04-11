import { lora, dmSans, plusJakarta, barlow, playfair, roboto } from "@/lib/fonts/resume-fonts"

export default function CriadorDeCurriculoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${lora.variable} ${dmSans.variable} ${plusJakarta.variable} ${barlow.variable} ${playfair.variable} ${roboto.variable}`}
    >
      {children}
    </div>
  )
}
