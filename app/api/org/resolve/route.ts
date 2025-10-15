import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const host = searchParams.get('host')
	if (!host)
		return NextResponse.json({ error: 'host required' }, { status: 400 })

	// Try exact domain match
	const domain = await prisma.organizationDomain.findUnique({
		where: { domain: host },
		include: { org: true },
	})
	if (domain) return NextResponse.json({ orgSlug: domain.org.slug })

	// Fallback: subdomain mapping e.g., acme.example.com -> acme
	const sub = host.split('.')[0]
	if (sub && sub !== 'www') {
		const org = await prisma.organization.findUnique({ where: { slug: sub } })
		if (org) return NextResponse.json({ orgSlug: org.slug })
	}

	return NextResponse.json({ orgSlug: null })
}
