import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	poweredByHeader: false,
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [{ hostname: "www.google.com" }],
	},
	async redirects() {
		return [
			{
				source: "/categorias/geradores-texto",
				destination: "/categorias/texto",
				permanent: true,
			},
			{
				source: "/categorias/csv",
				destination: "/categorias/dados",
				permanent: true,
			},
			{
				source: "/categorias/sorteios",
				destination: "/categorias/utilitarios",
				permanent: true,
			},
			{
				source: "/categorias/design",
				destination: "/categorias/desenvolvedor",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
