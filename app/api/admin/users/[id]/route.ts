import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch a specific user
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: params.id },
			include: {
				memberships: {
					include: {
						org: true,
					},
				},
			},
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json(user)
	} catch (error) {
		console.error('Error fetching user:', error)
		return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
	}
}

// PATCH - Update user information
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await request.json()
		const { name, email, avatarUrl } = body

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id: params.id },
		})

		if (!existingUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// If email is being changed, check if it's already in use
		if (email && email !== existingUser.email) {
			const emailInUse = await prisma.user.findUnique({
				where: { email },
			})

			if (emailInUse) {
				return NextResponse.json(
					{ error: 'Email already in use' },
					{ status: 400 }
				)
			}
		}

		// Update user
		const updatedUser = await prisma.user.update({
			where: { id: params.id },
			data: {
				...(name && { name }),
				...(email && { email }),
				...(avatarUrl !== undefined && { avatarUrl }),
			},
		})

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.error('Error updating user:', error)
		return NextResponse.json(
			{ error: 'Failed to update user' },
			{ status: 500 }
		)
	}
}

// DELETE - Delete a user
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id: params.id },
		})

		if (!existingUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Delete user (cascade will handle related records based on schema)
		await prisma.user.delete({
			where: { id: params.id },
		})

		return NextResponse.json({ message: 'User deleted successfully' })
	} catch (error) {
		console.error('Error deleting user:', error)
		return NextResponse.json(
			{ error: 'Failed to delete user' },
			{ status: 500 }
		)
	}
}
