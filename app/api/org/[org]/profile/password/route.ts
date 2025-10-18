import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// PATCH: Change user password
export async function PATCH(
	request: Request,
	{ params }: { params: { org: string } }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { currentPassword, newPassword } = body

		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{ error: 'Current password and new password are required' },
				{ status: 400 }
			)
		}

		if (newPassword.length < 8) {
			return NextResponse.json(
				{ error: 'New password must be at least 8 characters long' },
				{ status: 400 }
			)
		}

		// Get user with password hash
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: {
				id: true,
				passwordHash: true,
			},
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Verify current password
		if (!user.passwordHash) {
			return NextResponse.json(
				{ error: 'No password set for this account' },
				{ status: 400 }
			)
		}

		const isValidPassword = await bcrypt.compare(
			currentPassword,
			user.passwordHash
		)

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Current password is incorrect' },
				{ status: 400 }
			)
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10)

		// Update password
		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordHash: hashedPassword,
			},
		})

		return NextResponse.json({
			message: 'Password changed successfully',
		})
	} catch (error) {
		console.error('Error changing password:', error)
		return NextResponse.json(
			{ error: 'Failed to change password' },
			{ status: 500 }
		)
	}
}
