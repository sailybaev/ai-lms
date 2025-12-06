import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await requireSuperAdmin()

		const body = await request.json()
		const { isSuperAdmin } = body

		if (typeof isSuperAdmin !== 'boolean') {
			return NextResponse.json(
				{ error: 'isSuperAdmin must be a boolean' },
				{ status: 400 }
			)
		}

		const user = await prisma.user.update({
			where: { id: params.id },
			data: { isSuperAdmin },
			select: {
				id: true,
				email: true,
				name: true,
				isSuperAdmin: true,
			},
		})

		return NextResponse.json({ user })
	} catch (error) {
		console.error('Admin update error:', error)
		return NextResponse.json(
			{ error: 'Failed to update admin status' },
			{ status: 500 }
		)
	}
}
