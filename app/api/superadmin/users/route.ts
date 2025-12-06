import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		await requireSuperAdmin()

		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				isSuperAdmin: true,
				createdAt: true,
				_count: {
					select: {
						memberships: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json({ users })
	} catch (error) {
		console.error('Users fetch error:', error)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}
