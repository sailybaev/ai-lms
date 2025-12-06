import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string; membershipId: string } }
) {
	try {
		await requireSuperAdmin()

		const body = await request.json()
		const { role } = body

		// Validate input
		if (!role) {
			return NextResponse.json({ error: 'Role is required' }, { status: 400 })
		}

		if (!['admin', 'teacher', 'student'].includes(role)) {
			return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
		}

		// Verify membership exists and belongs to this organization
		const existingMembership = await prisma.membership.findUnique({
			where: { id: params.membershipId },
		})

		if (!existingMembership) {
			return NextResponse.json(
				{ error: 'Membership not found' },
				{ status: 404 }
			)
		}

		if (existingMembership.orgId !== params.id) {
			return NextResponse.json(
				{ error: 'Membership does not belong to this organization' },
				{ status: 400 }
			)
		}

		// Update membership role
		const membership = await prisma.membership.update({
			where: { id: params.membershipId },
			data: { role: role as Role },
			include: {
				user: {
					select: {
						id: true,
						email: true,
						name: true,
					},
				},
			},
		})

		return NextResponse.json({ membership })
	} catch (error) {
		console.error('Failed to update membership:', error)
		return NextResponse.json(
			{ error: 'Failed to update membership' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string; membershipId: string } }
) {
	try {
		await requireSuperAdmin()

		// Verify membership exists and belongs to this organization
		const existingMembership = await prisma.membership.findUnique({
			where: { id: params.membershipId },
		})

		if (!existingMembership) {
			return NextResponse.json(
				{ error: 'Membership not found' },
				{ status: 404 }
			)
		}

		if (existingMembership.orgId !== params.id) {
			return NextResponse.json(
				{ error: 'Membership does not belong to this organization' },
				{ status: 400 }
			)
		}

		// Delete membership
		await prisma.membership.delete({
			where: { id: params.membershipId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Failed to delete membership:', error)
		return NextResponse.json(
			{ error: 'Failed to delete membership' },
			{ status: 500 }
		)
	}
}
