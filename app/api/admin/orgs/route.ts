import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
	const orgs = await prisma.organization.findMany({
		select: {
			id: true,
			slug: true,
			name: true,
			platformName: true,
			createdAt: true,
			_count: {
				select: {
					memberships: true,
					courses: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})
	return NextResponse.json({ orgs })
}

export async function POST(req: Request) {
	const body = await req.json()
	const { slug, name } = body as { slug?: string; name?: string }
	if (!slug || !name)
		return NextResponse.json(
			{ error: 'slug and name required' },
			{ status: 400 }
		)
	const org = await prisma.organization.create({ data: { slug, name } })
	return NextResponse.json({ org })
}
