import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await request.json()
		const { name, platformName } = body

		if (!name) {
			return NextResponse.json({ error: 'Name is required' }, { status: 400 })
		}

		const org = await prisma.organization.update({
			where: { id: params.id },
			data: {
				name,
				platformName: platformName || null,
			},
		})

		return NextResponse.json({ org })
	} catch (error) {
		console.error('Organization update error:', error)
		return NextResponse.json(
			{ error: 'Failed to update organization' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const org = await prisma.organization.findUnique({
			where: { id: params.id },
			include: {
				_count: {
					select: {
						memberships: true,
						courses: true,
					},
				},
			},
		})

		if (!org) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		if (org._count.memberships > 0 || org._count.courses > 0) {
			return NextResponse.json(
				{
					error:
						'Cannot delete organization with existing members or courses',
				},
				{ status: 400 }
			)
		}

		await prisma.organization.delete({
			where: { id: params.id },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Organization delete error:', error)
		return NextResponse.json(
			{ error: 'Failed to delete organization' },
			{ status: 500 }
		)
	}
}
