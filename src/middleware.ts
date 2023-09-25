import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
 
export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const publicRoutes = [
        '/signin',
        '/signup'
    ]

    if (!publicRoutes.includes(req.nextUrl.pathname)) {
        const token = req.cookies.get('nextauth.token') || '';
        const { origin } = req.nextUrl

        if (!token) {
            return NextResponse.redirect(`${origin}/signin`)
        }
    }
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}