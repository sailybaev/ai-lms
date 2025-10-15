import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	_req: Request,
	{ params }: { params: { id: string } }
) {
	const domains = await prisma.organizationDomain.findMany({
		where: { orgId: params.id },
		select: { id: true, domain: true },
	})
	return NextResponse.json({ domains })
}

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const body = await req.json()
	const { domain } = body as { domain?: string }
	if (!domain)
		return NextResponse.json({ error: 'domain required' }, { status: 400 })
	const created = await prisma.organizationDomain.create({
		data: { orgId: params.id, domain },
	})
	return NextResponse.json({ domain: created })
}
