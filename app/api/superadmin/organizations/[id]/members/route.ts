import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await requireSuperAdmin()

		const members = await prisma.membership.findMany({
			where: { orgId: params.id },
			include: {
				user: {
					select: {
						id: true,
						email: true,
						name: true,
					},
				},
			},
			orderBy: [{ role: 'asc' }, { user: { name: 'asc' } }],
		})

		return NextResponse.json({ members })
	} catch (error) {
		console.error('Failed to fetch members:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch members' },
			{ status: 500 }
		)
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await requireSuperAdmin()

		const body = await request.json()
		const { email, name, password, role } = body

		// Validate input
		if (!email || !name || !password || !role) {
			return NextResponse.json(
				{ error: 'Email, name, password, and role are required' },
				{ status: 400 }
			)
		}

		if (!['admin', 'teacher', 'student'].includes(role)) {
			return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
		}

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { id: params.id },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Check if user already exists
		let user = await prisma.user.findUnique({
			where: { email },
		})

		if (user) {
			// Check if user is already a member of this organization
			const existingMembership = await prisma.membership.findUnique({
				where: {
					userId_orgId: {
						userId: user.id,
						orgId: params.id,
					},
				},
			})

			if (existingMembership) {
				return NextResponse.json(
					{ error: 'User is already a member of this organization' },
					{ status: 400 }
				)
			}
		} else {
			// Create new user
			const passwordHash = await bcrypt.hash(password, 10)
			user = await prisma.user.create({
				data: {
					email,
					name,
					passwordHash,
				},
			})
		}

		// Create membership
		const membership = await prisma.membership.create({
			data: {
				userId: user.id,
				orgId: params.id,
				role: role as Role,
				status: 'active',
			},
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
		console.error('Failed to add user to organization:', error)
		return NextResponse.json(
			{ error: 'Failed to add user to organization' },
			{ status: 500 }
		)
	}
}
