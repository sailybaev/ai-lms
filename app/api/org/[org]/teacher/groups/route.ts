import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET: List all groups assigned to the teacher (read-only)
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
		const { searchParams } = new URL(request.url)
		const courseId = searchParams.get('courseId')

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

		// Verify user is a teacher in this org
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'teacher',
					},
				},
			},
		})

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be a teacher in this organization' },
				{ status: 403 }
			)
		}

		// Build where clause - only show groups assigned to this teacher
		const where: any = {
			orgId: organization.id,
			assignedTeacherId: user.id, // Only groups assigned to this teacher
		}

		// If courseId is provided, filter by course
		if (courseId) {
			where.courseId = courseId
		}

		// Fetch groups
		const groups = await prisma.group.findMany({
			where,
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
				},
			},
			orderBy: {
				name: 'asc',
			},
		})

		// Format response
		const formattedGroups = groups.map((group: any) => ({
			id: group.id,
			name: group.name,
			description: group.description,
			courseId: group.courseId,
			courseName: group.course?.title,
			members: group.members.map((m: any) => ({
				id: m.user.id,
				name: m.user.name,
				email: m.user.email,
				avatarUrl: m.user.avatarUrl,
			})),
		}))

		return NextResponse.json({ groups: formattedGroups })
	} catch (error) {
		console.error('Error fetching groups:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch groups' },
			{ status: 500 }
		)
	}
}
