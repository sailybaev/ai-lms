import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8080'

/**
 * Generic proxy: forwards the incoming Next.js request to the Go backend,
 * injecting the stored JWT Bearer token from the NextAuth session.
 */
export async function proxyToBackend(
	req: Request,
	_ctx?: unknown
): Promise<Response> {
	const session = (await getServerSession(authOptions as any)) as any
	const token: string | undefined = session?.user?.backendToken

	const url = new URL(req.url)
	const backendUrl = `${BACKEND_URL}${url.pathname}${url.search}`

	const contentType = req.headers.get('content-type') ?? ''
	const isMultipart = contentType.includes('multipart/form-data')

	// Forward body for non-GET/HEAD requests
	let body: BodyInit | undefined
	if (!['GET', 'HEAD'].includes(req.method ?? 'GET')) {
		body = isMultipart ? await req.arrayBuffer() : await req.text()
	}

	const headers: Record<string, string> = {}
	if (token) headers['Authorization'] = `Bearer ${token}`
	// For multipart let fetch set the content-type (with boundary) automatically
	if (!isMultipart) headers['Content-Type'] = 'application/json'

	const upstream = await fetch(backendUrl, {
		method: req.method,
		headers,
		body,
	})

	const responseBody = await upstream.text()
	return new NextResponse(responseBody, {
		status: upstream.status,
		headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
	})
}
