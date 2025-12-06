import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		await requireSuperAdmin()

		const admins = await prisma.user.findMany({
			where: {
				isSuperAdmin: true,
			},
			select: {
				id: true,
				email: true,
				name: true,
				isSuperAdmin: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json({ admins })
	} catch (error) {
		console.error('Admins fetch error:', error)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}

export async function POST(request: Request) {
	try {
		await requireSuperAdmin()

		const body = await request.json()
		const { email, name, password } = body

		if (!email || !name || !password) {
			return NextResponse.json(
				{ error: 'Email, name, and password are required' },
				{ status: 400 }
			)
		}

		// Check if user already exists
		const existing = await prisma.user.findUnique({
			where: { email },
		})

		if (existing) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 400 }
			)
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10)

		// Create super admin user
		const admin = await prisma.user.create({
			data: {
				email,
				name,
				passwordHash,
				isSuperAdmin: true,
			},
			select: {
				id: true,
				email: true,
				name: true,
				isSuperAdmin: true,
				createdAt: true,
			},
		})

		return NextResponse.json({ admin })
	} catch (error) {
		console.error('Admin creation error:', error)
		return NextResponse.json(
			{ error: 'Failed to create super admin' },
			{ status: 500 }
		)
	}
}
