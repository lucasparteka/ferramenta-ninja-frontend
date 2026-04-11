import {
  Lora,
  DM_Sans,
  Plus_Jakarta_Sans,
  Barlow,
  Playfair_Display,
  Roboto,
} from "next/font/google";

export const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
export const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
export const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
export const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
export const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });

export const resumeFontVars = [
  lora.variable,
  dmSans.variable,
  plusJakarta.variable,
  barlow.variable,
  playfair.variable,
  roboto.variable,
].join(" ");
