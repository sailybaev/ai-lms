import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		await requireSuperAdmin()

		const [totalOrganizations, totalUsers, totalSuperAdmins] = await Promise.all([
			prisma.organization.count(),
			prisma.user.count(),
			prisma.user.count({ where: { isSuperAdmin: true } }),
		])

		const activeOrganizations = await prisma.organization.count({
			where: {
				memberships: {
					some: {
						status: 'active',
					},
				},
			},
		})

		return NextResponse.json({
			totalOrganizations,
			totalUsers,
			totalSuperAdmins,
			activeOrganizations,
		})
	} catch (error) {
		console.error('Stats fetch error:', error)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}
