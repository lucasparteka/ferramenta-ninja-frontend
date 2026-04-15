import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	poweredByHeader: false,
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [{ hostname: "www.google.com" }],
	},
};

export default nextConfig;
