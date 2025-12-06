import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const RESERVED_HOSTS = new Set(['localhost', '127.0.0.1'])

export async function middleware(req: NextRequest) {
	const url = req.nextUrl
	const host = req.headers.get('host') || ''

	// Skip for static assets and API
	const pathname = url.pathname
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/public')
	) {
		return NextResponse.next()
	}

	// Skip middleware for public routes
	if (
		pathname === '/login' ||
		pathname.startsWith('/superadmin')
	) {
		return NextResponse.next()
	}

	// If path already has org prefix, enforce auth except login
	const first = pathname.split('/').filter(Boolean)[0]
	const hasOrgPrefix = Boolean(
		first && !['admin', 'teacher', 'student', 'superadmin', 'login'].includes(first)
	)
	if (hasOrgPrefix) {
		// Allow login page unauthenticated
		if (pathname === `/${first}/login`) return NextResponse.next()
		// Check auth via NextAuth session token cookie (simple presence check)
		const hasSession =
			req.cookies.get('next-auth.session-token') ||
			req.cookies.get('__Secure-next-auth.session-token')
		if (!hasSession) {
			const loginUrl = new URL(`/${first}/login`, req.url)
			loginUrl.searchParams.set('callbackUrl', pathname)
			return NextResponse.redirect(loginUrl)
		}
		return NextResponse.next()
	}

	// Resolve org via API route to allow DB lookup
	const isReserved = RESERVED_HOSTS.has(host) || host.includes('localhost')
	if (!isReserved) {
		try {
			const res = await fetch(
				`${url.origin}/api/org/resolve?host=${encodeURIComponent(host)}`
			)
			if (res.ok) {
				const data = (await res.json()) as { orgSlug: string | null }
				if (data.orgSlug) {
					const newPath = `/${data.orgSlug}${pathname}`
					const rewriteUrl = new URL(newPath, req.url)
					return NextResponse.rewrite(rewriteUrl)
				}
			}
		} catch {
			// ignore and continue
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		// Match all pages except the ones starting with:
		// - api (API routes)
		// - _next/static (static files)
		// - _next/image (image optimization files)
		// - favicon.ico (favicon file)
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
