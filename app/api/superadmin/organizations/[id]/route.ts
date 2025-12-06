import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await requireSuperAdmin()

		const organization = await prisma.organization.findUnique({
			where: { id: params.id },
			select: {
				id: true,
				name: true,
				slug: true,
				platformName: true,
				domain: true,
				_count: {
					select: {
						members: true,
						courses: true,
					},
				},
			},
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ organization })
	} catch (error) {
		console.error('Failed to fetch organization:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch organization' },
			{ status: 500 }
		)
	}
}
