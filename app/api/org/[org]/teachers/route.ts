import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET: List all teachers in the organization
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Verify user is admin in this org
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'admin',
					},
				},
			},
		})

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an organization admin to view teachers' },
				{ status: 403 }
			)
		}

		// Get all teachers in the organization
		const teachers = await prisma.membership.findMany({
			where: {
				orgId: organization.id,
				role: 'teacher',
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						avatarUrl: true,
						createdAt: true,
						lastActiveAt: true,
					},
				},
			},
			orderBy: {
				user: {
					name: 'asc',
				},
			},
		})

		return NextResponse.json({
			teachers: teachers.map(t => ({
				id: t.user.id,
				name: t.user.name,
				email: t.user.email,
				avatarUrl: t.user.avatarUrl,
				status: t.status,
				membershipId: t.id,
				joinedAt: t.user.createdAt,
				lastActiveAt: t.user.lastActiveAt,
			})),
		})
	} catch (error) {
		console.error('Error fetching teachers:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch teachers' },
			{ status: 500 }
		)
	}
}

// POST: Add a new teacher to the organization
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const body = await request.json()
		const { name, email, password } = body

		if (!name || !email) {
			return NextResponse.json(
				{ error: 'Name and email are required' },
				{ status: 400 }
			)
		}

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Verify user is admin in this org
		const adminUser = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'admin',
					},
				},
			},
		})

		if (!adminUser || adminUser.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an organization admin to add teachers' },
				{ status: 403 }
			)
		}

		// Check if user already exists
		let user = await prisma.user.findUnique({
			where: { email },
		})

		if (user) {
			// Check if already a member of this org
			const existingMembership = await prisma.membership.findUnique({
				where: {
					orgId_userId: {
						orgId: organization.id,
						userId: user.id,
					},
				},
			})

			if (existingMembership) {
				return NextResponse.json(
					{ error: 'User is already a member of this organization' },
					{ status: 400 }
				)
			}

			// Add existing user to org as teacher
			const membership = await prisma.membership.create({
				data: {
					orgId: organization.id,
					userId: user.id,
					role: 'teacher',
					status: 'active',
				},
			})

			return NextResponse.json({
				message: 'Existing user added to organization as teacher',
				teacher: {
					id: user.id,
					name: user.name,
					email: user.email,
					avatarUrl: user.avatarUrl,
					status: membership.status,
					membershipId: membership.id,
					joinedAt: user.createdAt,
				},
			})
		}

		// Create new user
		const hashedPassword = password
			? await bcrypt.hash(password, 10)
			: await bcrypt.hash(Math.random().toString(36).slice(-8), 10) // Generate random password if not provided

		user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword,
				memberships: {
					create: {
						orgId: organization.id,
						role: 'teacher',
						status: 'active',
					},
				},
			},
		})

		return NextResponse.json(
			{
				message: 'Teacher added successfully',
				teacher: {
					id: user.id,
					name: user.name,
					email: user.email,
					avatarUrl: user.avatarUrl,
					status: 'active',
					joinedAt: user.createdAt,
				},
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error adding teacher:', error)
		return NextResponse.json(
			{ error: 'Failed to add teacher' },
			{ status: 500 }
		)
	}
}

// PUT: Update teacher information
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const body = await request.json()
		const { userId, name, email, avatarUrl, newPassword } = body

		if (!userId || !name || !email) {
			return NextResponse.json(
				{ error: 'User ID, name, and email are required' },
				{ status: 400 }
			)
		}

		// Validate password if provided
		if (newPassword && newPassword.length < 8) {
			return NextResponse.json(
				{ error: 'Password must be at least 8 characters long' },
				{ status: 400 }
			)
		}

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Verify user is admin in this org
		const adminUser = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'admin',
					},
				},
			},
		})

		if (!adminUser || adminUser.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an organization admin to update teachers' },
				{ status: 403 }
			)
		}

		// Check if the teacher is part of this organization
		const membership = await prisma.membership.findUnique({
			where: {
				orgId_userId: {
					orgId: organization.id,
					userId: userId,
				},
			},
		})

		if (!membership || membership.role !== 'teacher') {
			return NextResponse.json(
				{ error: 'Teacher not found in this organization' },
				{ status: 404 }
			)
		}

		// Check if email is already in use by another user
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser && existingUser.id !== userId) {
			return NextResponse.json(
				{ error: 'Email is already in use by another user' },
				{ status: 400 }
			)
		}

		// Prepare update data
		const updateData: any = {
			name,
			email,
		}

		// Add avatarUrl if provided
		if (avatarUrl !== undefined) {
			updateData.avatarUrl = avatarUrl
		}

		// Hash and add password if provided
		if (newPassword) {
			updateData.passwordHash = await bcrypt.hash(newPassword, 10)
		}

		// Update user
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: updateData,
		})

		return NextResponse.json({
			message: 'Teacher updated successfully',
			teacher: {
				id: updatedUser.id,
				name: updatedUser.name,
				email: updatedUser.email,
				avatarUrl: updatedUser.avatarUrl,
			},
		})
	} catch (error) {
		console.error('Error updating teacher:', error)
		return NextResponse.json(
			{ error: 'Failed to update teacher' },
			{ status: 500 }
		)
	}
}

// PATCH: Update teacher membership status
export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const body = await request.json()
		const { membershipId, status } = body

		if (!membershipId || !status) {
			return NextResponse.json(
				{ error: 'Membership ID and status are required' },
				{ status: 400 }
			)
		}

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Verify user is admin in this org
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'admin',
					},
				},
			},
		})

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an organization admin to update teachers' },
				{ status: 403 }
			)
		}

		// Update membership
		const updatedMembership = await prisma.membership.update({
			where: {
				id: membershipId,
				orgId: organization.id,
				role: 'teacher',
			},
			data: {
				status,
			},
			include: {
				user: true,
			},
		})

		return NextResponse.json({
			message: 'Teacher status updated successfully',
			teacher: {
				id: updatedMembership.user.id,
				name: updatedMembership.user.name,
				email: updatedMembership.user.email,
				status: updatedMembership.status,
				membershipId: updatedMembership.id,
			},
		})
	} catch (error) {
		console.error('Error updating teacher:', error)
		return NextResponse.json(
			{ error: 'Failed to update teacher' },
			{ status: 500 }
		)
	}
}

// DELETE: Remove teacher from organization
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const { searchParams } = new URL(request.url)
		const membershipId = searchParams.get('membershipId')

		if (!membershipId) {
			return NextResponse.json(
				{ error: 'Membership ID is required' },
				{ status: 400 }
			)
		}

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Verify user is admin in this org
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'admin',
					},
				},
			},
		})

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an organization admin to remove teachers' },
				{ status: 403 }
			)
		}

		// Delete membership
		await prisma.membership.delete({
			where: {
				id: membershipId,
				orgId: organization.id,
				role: 'teacher',
			},
		})

		return NextResponse.json({
			message: 'Teacher removed from organization successfully',
		})
	} catch (error) {
		console.error('Error removing teacher:', error)
		return NextResponse.json(
			{ error: 'Failed to remove teacher' },
			{ status: 500 }
		)
	}
}
