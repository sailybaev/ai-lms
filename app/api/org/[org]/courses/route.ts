import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET: List all courses in the organization
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
				{ error: 'You must be an organization admin to view courses' },
				{ status: 403 }
			)
		}

		// Fetch all courses for the organization
		const courses = await prisma.course.findMany({
			where: {
				orgId: organization.id,
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
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		// Format the response
		const formattedCourses = courses.map(course => ({
			id: course.id,
			title: course.title,
			description: course.description,
			thumbnailUrl: course.thumbnailUrl,
			status: course.status,
			createdBy: course.createdBy,
			instructors: course.instructors.map(i => i.user),
			enrollmentCount: course.enrollments.length,
			createdAt: course.createdAt.toISOString(),
		}))

		return NextResponse.json({ courses: formattedCourses })
	} catch (error) {
		console.error('Error fetching courses:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch courses' },
			{ status: 500 }
		)
	}
}

// POST: Create a new course
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

		// Parse request body
		const body = await request.json()
		const { title, description, thumbnailUrl, status, instructorIds } = body

		if (!title) {
			return NextResponse.json(
				{ error: 'Course title is required' },
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
				{ error: 'You must be an organization admin to create courses' },
				{ status: 403 }
			)
		}

		// Create the course
		const course = await prisma.course.create({
			data: {
				orgId: organization.id,
				title,
				description: description || null,
				thumbnailUrl: thumbnailUrl || null,
				status: status || 'draft',
				createdById: adminUser.id,
			},
			include: {
				createdBy: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		})

		// Add instructors if provided
		if (
			instructorIds &&
			Array.isArray(instructorIds) &&
			instructorIds.length > 0
		) {
			await prisma.courseInstructor.createMany({
				data: instructorIds.map((userId: string) => ({
					courseId: course.id,
					userId,
				})),
				skipDuplicates: true,
			})
		}

		// Fetch the complete course with instructors
		const completeCourse = await prisma.course.findUnique({
			where: { id: course.id },
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
					},
				},
			},
		})

		return NextResponse.json(
			{
				message: 'Course created successfully',
				course: {
					...completeCourse,
					instructors: completeCourse?.instructors.map(i => i.user) || [],
					enrollmentCount: completeCourse?.enrollments.length || 0,
				},
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating course:', error)
		return NextResponse.json(
			{ error: 'Failed to create course' },
			{ status: 500 }
		)
	}
}

// PUT: Update course information
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

		// Parse request body
		const body = await request.json()
		const {
			courseId,
			title,
			description,
			thumbnailUrl,
			status,
			instructorIds,
		} = body

		if (!courseId) {
			return NextResponse.json(
				{ error: 'Course ID is required' },
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
				{ error: 'You must be an organization admin to update courses' },
				{ status: 403 }
			)
		}

		// Check if the course belongs to this organization
		const course = await prisma.course.findFirst({
			where: {
				id: courseId,
				orgId: organization.id,
			},
		})

		if (!course) {
			return NextResponse.json(
				{ error: 'Course not found in this organization' },
				{ status: 404 }
			)
		}

		// Update the course
		const updatedCourse = await prisma.course.update({
			where: { id: courseId },
			data: {
				title: title || course.title,
				description:
					description !== undefined ? description : course.description,
				thumbnailUrl:
					thumbnailUrl !== undefined ? thumbnailUrl : course.thumbnailUrl,
				status: status || course.status,
			},
			include: {
				createdBy: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		})

		// Update instructors if provided
		if (instructorIds !== undefined && Array.isArray(instructorIds)) {
			// Remove all existing instructors
			await prisma.courseInstructor.deleteMany({
				where: { courseId },
			})

			// Add new instructors
			if (instructorIds.length > 0) {
				await prisma.courseInstructor.createMany({
					data: instructorIds.map((userId: string) => ({
						courseId,
						userId,
					})),
					skipDuplicates: true,
				})
			}
		}

		// Fetch the complete course with instructors
		const completeCourse = await prisma.course.findUnique({
			where: { id: courseId },
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
					},
				},
			},
		})

		return NextResponse.json({
			message: 'Course updated successfully',
			course: {
				...completeCourse,
				instructors: completeCourse?.instructors.map(i => i.user) || [],
				enrollmentCount: completeCourse?.enrollments.length || 0,
			},
		})
	} catch (error) {
		console.error('Error updating course:', error)
		return NextResponse.json(
			{ error: 'Failed to update course' },
			{ status: 500 }
		)
	}
}

// DELETE: Delete a course
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

		// Get courseId from query params
		const { searchParams } = new URL(request.url)
		const courseId = searchParams.get('courseId')

		if (!courseId) {
			return NextResponse.json(
				{ error: 'Course ID is required' },
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
				{ error: 'You must be an organization admin to delete courses' },
				{ status: 403 }
			)
		}

		// Check if the course belongs to this organization
		const course = await prisma.course.findFirst({
			where: {
				id: courseId,
				orgId: organization.id,
			},
		})

		if (!course) {
			return NextResponse.json(
				{ error: 'Course not found in this organization' },
				{ status: 404 }
			)
		}

		// Delete the course (cascade will handle related records)
		await prisma.course.delete({
			where: { id: courseId },
		})

		return NextResponse.json({
			message: 'Course deleted successfully',
		})
	} catch (error) {
		console.error('Error deleting course:', error)
		return NextResponse.json(
			{ error: 'Failed to delete course' },
			{ status: 500 }
		)
	}
}
