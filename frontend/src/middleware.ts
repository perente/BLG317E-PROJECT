import { NextRequest, NextResponse } from "next/server";


export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!request.cookies.get("auth")) {
            return NextResponse.redirect(
                request.nextUrl.origin + "/login"
            );
        }
    }
    if (request.nextUrl.pathname.startsWith("/login")) {
        if (request.cookies.get("auth")) {
            return NextResponse.redirect(
                request.nextUrl.origin + "/admin"
            );
        }
    }
}


