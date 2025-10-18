import { prisma } from '@/lib/db'
import { MembershipStatus, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Update user membership (role and status)
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await request.json()
		const { orgId, role, status } = body

		if (!orgId) {
			return NextResponse.json(
				{ error: 'Organization ID is required' },
				{ status: 400 }
			)
		}

		// Validate role if provided
		if (role && !Object.values(Role).includes(role)) {
			return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
		}

		// Validate status if provided
		if (status && !Object.values(MembershipStatus).includes(status)) {
			return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
		}

		// Check if membership exists
		const membership = await prisma.membership.findUnique({
			where: {
				orgId_userId: {
					orgId,
					userId: params.id,
				},
			},
		})

		if (!membership) {
			return NextResponse.json(
				{ error: 'Membership not found' },
				{ status: 404 }
			)
		}

		// Update membership
		const updatedMembership = await prisma.membership.update({
			where: {
				orgId_userId: {
					orgId,
					userId: params.id,
				},
			},
			data: {
				...(role && { role }),
				...(status && { status }),
			},
			include: {
				user: true,
				org: true,
			},
		})

		return NextResponse.json(updatedMembership)
	} catch (error) {
		console.error('Error updating membership:', error)
		return NextResponse.json(
			{ error: 'Failed to update membership' },
			{ status: 500 }
		)
	}
}
