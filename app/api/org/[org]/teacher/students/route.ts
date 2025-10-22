import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET: List all students enrolled in courses taught by the current teacher
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

		// Get courseId filter from query params if provided
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

		// Get all courses taught by this teacher
		const teacherCourses = await prisma.course.findMany({
			where: {
				orgId: organization.id,
				...(courseId ? { id: courseId } : {}),
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
			select: {
				id: true,
				title: true,
			},
		})

		if (teacherCourses.length === 0) {
			return NextResponse.json({ students: [] })
		}

		const courseIds = teacherCourses.map((c: any) => c.id)

		// Get all students enrolled in these courses
		const enrollments = await prisma.enrollment.findMany({
			where: {
				courseId: {
					in: courseIds,
				},
				status: 'active',
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						avatarUrl: true,
						lastActiveAt: true,
					},
				},
				course: {
					select: {
						id: true,
						title: true,
					},
				},
			},
		})

		if (enrollments.length === 0) {
			return NextResponse.json({ students: [] })
		}

		// Get progress data for each student
		const studentIds = [...new Set(enrollments.map((e: any) => e.user.id))]

		const progressData = await prisma.progressEvent.findMany({
			where: {
				userId: {
					in: studentIds,
				},
				courseId: {
					in: courseIds,
				},
				type: 'viewed_lesson',
			},
			select: {
				userId: true,
				courseId: true,
				lessonId: true,
			},
		})

		// Get total lessons per course
		const courseLessons = await prisma.courseSection.findMany({
			where: {
				courseId: {
					in: courseIds,
				},
			},
			include: {
				lessons: {
					select: {
						id: true,
					},
				},
			},
		})

		const totalLessonsPerCourse = courseLessons.reduce(
			(acc: any, section: any) => {
				const courseId = section.courseId
				acc[courseId] = (acc[courseId] || 0) + section.lessons.length
				return acc
			},
			{} as Record<string, number>
		)

		// Get submissions and grades for students
		const submissions = await prisma.submission.findMany({
			where: {
				userId: {
					in: studentIds,
				},
				assignment: {
					courseId: {
						in: courseIds,
					},
				},
			},
			include: {
				grade: true,
				assignment: {
					select: {
						courseId: true,
						maxPoints: true,
					},
				},
			},
		})

		// Calculate progress and grades for each student-course combination
		const studentMap = new Map<string, any>()

		enrollments.forEach((enrollment: any) => {
			const key = `${enrollment.user.id}-${enrollment.course.id}`

			// Calculate progress
			const completedLessons = progressData.filter(
				(p: any) =>
					p.userId === enrollment.user.id && p.courseId === enrollment.course.id
			).length
			const totalLessons = totalLessonsPerCourse[enrollment.course.id] || 1
			const progress = Math.round((completedLessons / totalLessons) * 100)

			// Calculate grade
			const studentSubmissions = submissions.filter(
				(s: any) =>
					s.userId === enrollment.user.id &&
					s.assignment.courseId === enrollment.course.id
			)

			let averageGrade = null
			let gradeLetters = 'N/A'

			if (studentSubmissions.length > 0) {
				const gradesWithScores = studentSubmissions.filter((s: any) => s.grade)
				if (gradesWithScores.length > 0) {
					const totalScore = gradesWithScores.reduce(
						(sum: number, s: any) => sum + (s.grade?.score || 0),
						0
					)
					const totalPossible = gradesWithScores.reduce(
						(sum: number, s: any) => sum + (s.assignment.maxPoints || 100),
						0
					)
					averageGrade = Math.round((totalScore / totalPossible) * 100)

					// Convert to letter grade
					if (averageGrade >= 90) gradeLetters = 'A'
					else if (averageGrade >= 85) gradeLetters = 'A-'
					else if (averageGrade >= 80) gradeLetters = 'B+'
					else if (averageGrade >= 75) gradeLetters = 'B'
					else if (averageGrade >= 70) gradeLetters = 'B-'
					else if (averageGrade >= 65) gradeLetters = 'C+'
					else if (averageGrade >= 60) gradeLetters = 'C'
					else if (averageGrade >= 55) gradeLetters = 'C-'
					else if (averageGrade >= 50) gradeLetters = 'D'
					else gradeLetters = 'F'
				}
			}

			// Calculate last active time
			const lastActive = enrollment.user.lastActiveAt
			let lastActiveText = 'Never'
			if (lastActive) {
				const diff = Date.now() - new Date(lastActive).getTime()
				const hours = Math.floor(diff / (1000 * 60 * 60))
				const days = Math.floor(hours / 24)

				if (days > 0) lastActiveText = `${days} day${days > 1 ? 's' : ''} ago`
				else if (hours > 0)
					lastActiveText = `${hours} hour${hours > 1 ? 's' : ''} ago`
				else lastActiveText = 'Recently'
			}

			if (!studentMap.has(enrollment.user.id)) {
				studentMap.set(enrollment.user.id, {
					id: enrollment.user.id,
					name: enrollment.user.name,
					email: enrollment.user.email,
					avatarUrl: enrollment.user.avatarUrl,
					lastActive: lastActiveText,
					courses: [],
				})
			}

			studentMap.get(enrollment.user.id).courses.push({
				id: enrollment.course.id,
				title: enrollment.course.title,
				progress,
				grade: gradeLetters,
				averageScore: averageGrade,
			})
		})

		// Convert to array and sort by name
		const students = Array.from(studentMap.values()).sort((a, b) =>
			a.name.localeCompare(b.name)
		)

		return NextResponse.json({ students })
	} catch (error) {
		console.error('Error fetching students:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch students' },
			{ status: 500 }
		)
	}
}
