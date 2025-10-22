import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET: List all courses taught by the current teacher
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

		// Fetch courses where the user is either the creator or an instructor
		const courses = await prisma.course.findMany({
			where: {
				orgId: organization.id,
				OR: [
					{ createdById: user.id },
					{
						instructors: {
							some: {
								userId: user.id,
							},
						},
					},
				],
			},
			include: {
				createdBy: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				instructors: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
				},
				enrollments: {
					select: {
						id: true,
						status: true,
					},
				},
				sections: {
					include: {
						lessons: {
							select: {
								id: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		// Format the response with aggregated stats
		const formattedCourses = courses.map((course: any) => {
			const totalLessons = course.sections.reduce(
				(sum: number, section: any) => sum + section.lessons.length,
				0
			)
			const activeEnrollments = course.enrollments.filter(
				(e: any) => e.status === 'active'
			).length

			return {
				id: course.id,
				title: course.title,
				description: course.description,
				thumbnailUrl: course.thumbnailUrl,
				status: course.status,
				createdBy: course.createdBy,
				instructors: course.instructors.map((i: any) => i.user),
				students: activeEnrollments,
				lessons: totalLessons,
				enrollmentCount: course.enrollments.length,
				createdAt: course.createdAt.toISOString(),
			}
		})

		return NextResponse.json({ courses: formattedCourses })
	} catch (error) {
		console.error('Error fetching teacher courses:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch courses' },
			{ status: 500 }
		)
	}
}
