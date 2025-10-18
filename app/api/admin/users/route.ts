import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all users with optional filters
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const role = searchParams.get('role')
		const status = searchParams.get('status')
		const search = searchParams.get('search')
		const orgId = searchParams.get('orgId')

		// Build where clause
		const where: any = {}

		if (orgId) {
			where.memberships = {
				some: {
					orgId,
					...(role && { role: role.toLowerCase() }),
					...(status && { status: status.toLowerCase() }),
				},
			}
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } },
			]
		}

		const users = await prisma.user.findMany({
			where,
			include: {
				memberships: {
					include: {
						org: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json(users)
	} catch (error) {
		console.error('Error fetching users:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		)
	}
}

// POST - Create a new user
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { name, email, role, orgId } = body

		// Validate required fields
		if (!name || !email || !role || !orgId) {
			return NextResponse.json(
				{ error: 'Name, email, role, and organization are required' },
				{ status: 400 }
			)
		}

		// Check if email already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Email already in use' },
				{ status: 400 }
			)
		}

		// Create user with membership
		const user = await prisma.user.create({
			data: {
				name,
				email,
				memberships: {
					create: {
						orgId,
						role: role.toLowerCase(),
						status: 'active',
					},
				},
			},
			include: {
				memberships: {
					include: {
						org: true,
					},
				},
			},
		})

		return NextResponse.json(user, { status: 201 })
	} catch (error) {
		console.error('Error creating user:', error)
		return NextResponse.json(
			{ error: 'Failed to create user' },
			{ status: 500 }
		)
	}
}
