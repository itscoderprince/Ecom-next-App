import { ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "@/routes/Website.route"
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Middleware
export async function proxy(req) {
    try {
        const pathname = req.nextUrl.pathname
        const hasToken = req.cookies.has("access_token")

        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl))
            }
            return NextResponse.next();
        }

        const access_token = req.cookies.get("access_token")
        const { payload } = await jwtVerify(access_token.value, new TextEncoder().encode(process.env.SECRET_KEY));

        const role = payload.role
        if (pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, req.nextUrl))
        }

        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(USER_DASHBOARD, req.nextUrl))

        }
        if (pathname.startsWith('/my-account') && role !== 'user') {
            return NextResponse.redirect(new URL(USER_DASHBOARD, req.nextUrl))

        }
        return NextResponse.next();

    } catch (error) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl))
    }
}

export const config = {
    matcher: ['/auth/:path*', '/my-account/:path*', '/admin/:path*']
}
