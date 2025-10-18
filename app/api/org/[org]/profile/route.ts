import { requireAuth } from '@/lib/auth'
import { getUserProfile } from '@/lib/user-profile'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/org/[org]/profile - Get current user's profile
export async function GET(
	req: NextRequest,
	{ params }: { params: { org: string } }
) {
	try {
		const session = (await requireAuth()) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userEmail = session.user.email
		const profile = await getUserProfile(userEmail, params.org)

		if (!profile) {
			return NextResponse.json(
				{ error: 'Profile not found or not a member of this organization' },
				{ status: 404 }
			)
		}

		return NextResponse.json(profile)
	} catch (error) {
		console.error('Error fetching profile:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch profile' },
			{ status: 500 }
		)
	}
}

// PATCH /api/org/[org]/profile - Update current user's profile
export async function PATCH(
	req: NextRequest,
	{ params }: { params: { org: string } }
) {
	try {
		const session = (await requireAuth()) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userEmail = session.user.email
		const body = await req.json()
		const { name, avatarUrl } = body

		// Validate input
		const { validateProfileUpdate, checkUserMembership, updateUserProfile } =
			await import('@/lib/user-profile')
		const validation = validateProfileUpdate(body)

		if (!validation.valid) {
			return NextResponse.json(
				{ error: 'Validation failed', errors: validation.errors },
				{ status: 400 }
			)
		}

		// Check if user is member of this organization
		const membership = await checkUserMembership(userEmail, params.org)

		if (!membership) {
			return NextResponse.json(
				{ error: 'Not a member of this organization' },
				{ status: 403 }
			)
		}

		// Update user
		const updatedUser = await updateUserProfile(userEmail, { name, avatarUrl })

		return NextResponse.json({
			user: updatedUser,
			success: true,
		})
	} catch (error) {
		console.error('Error updating profile:', error)
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Failed to update profile',
			},
			{ status: 500 }
		)
	}
}

// DELETE /api/org/[org]/profile - Remove user membership from organization
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { org: string } }
) {
	try {
		const session = (await requireAuth()) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userEmail = session.user.email
		const { checkUserMembership } = await import('@/lib/user-profile')
		const { prisma } = await import('@/lib/db')

		// Check if user is member of this organization
		const membership = await checkUserMembership(userEmail, params.org)

		if (!membership) {
			return NextResponse.json(
				{ error: 'Not a member of this organization' },
				{ status: 403 }
			)
		}

		// Suspend membership instead of deleting (soft delete)
		await prisma.membership.update({
			where: {
				id: membership.id,
			},
			data: {
				status: 'suspended',
			},
		})

		return NextResponse.json({
			success: true,
			message: 'Membership suspended successfully',
		})
	} catch (error) {
		console.error('Error removing membership:', error)
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Failed to remove membership',
			},
			{ status: 500 }
		)
	}
}
