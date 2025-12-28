import { ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "@/routes/Website.route"
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Middleware
// Middleware to handle auth-based routing protection
export default async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("access_token")?.value;

    try {
        // 1. If no token, redirect to login unless already on an auth page
        if (!token) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
            }
            return NextResponse.next();
        }

        // 2. Verify token
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.SECRET_KEY)
        );

        const { role } = payload;

        // 3. User is authenticated, prevent visiting auth pages
        if (pathname.startsWith('/auth')) {
            const dashboard = role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD;
            return NextResponse.redirect(new URL(dashboard, req.nextUrl));
        }

        // 4. Role-based access control
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(USER_DASHBOARD, req.nextUrl));
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Middleware Auth Error:", error.message);
        // If token verification fails (expired/invalid), clear and redirect
        const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
        response.cookies.delete("access_token");
        return response;
    }
}

export const config = {
    matcher: ['/auth/:path*', '/my-account/:path*', '/admin/:path*']
}
