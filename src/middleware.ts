import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/curriculo-render/")) {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-is-pdf-render", "1");
		return NextResponse.next({ request: { headers: requestHeaders } });
	}
	return NextResponse.next();
}

export const config = {
	matcher: "/curriculo-render/:path*",
};
