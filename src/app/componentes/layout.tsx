import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Componentes",
	robots: {
		index: false,
		follow: false,
	},
};

export default function ComponentesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
