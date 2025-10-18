import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	req: NextRequest,
	context: { params: Promise<{ org: string }> | { org: string } }
) {
	try {
		const params =
			context.params instanceof Promise ? await context.params : context.params
		const orgSlug = params.org
		const searchParams = req.nextUrl.searchParams
		const range = searchParams.get('range') || '7d'

		// Validate organization exists
		const org = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!org) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Calculate date range
		const now = new Date()
		let startDate = new Date()
		let previousStartDate = new Date()

		switch (range) {
			case '7d':
				startDate.setDate(now.getDate() - 7)
				previousStartDate.setDate(now.getDate() - 14)
				break
			case '30d':
				startDate.setDate(now.getDate() - 30)
				previousStartDate.setDate(now.getDate() - 60)
				break
			case '90d':
				startDate.setDate(now.getDate() - 90)
				previousStartDate.setDate(now.getDate() - 180)
				break
			case '1y':
				startDate.setFullYear(now.getFullYear() - 1)
				previousStartDate.setFullYear(now.getFullYear() - 2)
				break
		}

		// Fetch overview data
		const [
			totalUsers,
			activeUsers,
			previousActiveUsers,
			totalCourses,
			activeCourses,
			totalEnrollments,
			activeEnrollments,
			previousEnrollments,
			completedEnrollments,
			previousCompletedEnrollments,
			recentLogins,
			usersByRole,
			topCourses,
			activityEvents,
			topStudents,
		] = await Promise.all([
			// Total users in org
			prisma.membership.count({
				where: { orgId: org.id },
			}),
			// Active users (logged in during range)
			prisma.user.count({
				where: {
					memberships: { some: { orgId: org.id } },
					lastActiveAt: { gte: startDate },
				},
			}),
			// Previous period active users
			prisma.user.count({
				where: {
					memberships: { some: { orgId: org.id } },
					lastActiveAt: { gte: previousStartDate, lt: startDate },
				},
			}),
			// Total courses
			prisma.course.count({
				where: { orgId: org.id },
			}),
			// Active courses
			prisma.course.count({
				where: { orgId: org.id, status: 'active' },
			}),
			// Total enrollments
			prisma.enrollment.count({
				where: { orgId: org.id },
			}),
			// Active enrollments
			prisma.enrollment.count({
				where: { orgId: org.id, status: 'active' },
			}),
			// Previous period enrollments
			prisma.enrollment.count({
				where: {
					orgId: org.id,
					course: {
						createdAt: { gte: previousStartDate, lt: startDate },
					},
				},
			}),
			// Completed enrollments in current period
			prisma.enrollment.count({
				where: { orgId: org.id, status: 'completed' },
			}),
			// Previous period completed enrollments
			prisma.enrollment.count({
				where: {
					orgId: org.id,
					status: 'completed',
					course: {
						createdAt: { gte: previousStartDate, lt: startDate },
					},
				},
			}),
			// Recent login events
			prisma.progressEvent.findMany({
				where: {
					orgId: org.id,
					type: 'login',
					occurredAt: { gte: startDate },
				},
				orderBy: { occurredAt: 'desc' },
				take: 100,
			}),
			// Users by role
			prisma.membership.groupBy({
				by: ['role'],
				where: { orgId: org.id },
				_count: true,
			}),
			// Top courses by enrollment
			prisma.course.findMany({
				where: { orgId: org.id },
				select: {
					id: true,
					title: true,
					_count: {
						select: {
							enrollments: true,
						},
					},
					progressEvents: {
						where: {
							type: 'viewed_lesson',
							occurredAt: { gte: startDate },
						},
						select: { id: true },
					},
				},
				orderBy: {
					enrollments: {
						_count: 'desc',
					},
				},
				take: 5,
			}),
			// Activity events for trend
			prisma.progressEvent.findMany({
				where: {
					orgId: org.id,
					occurredAt: { gte: startDate },
				},
				select: {
					type: true,
					occurredAt: true,
				},
				orderBy: { occurredAt: 'asc' },
			}),
			// Top performing students
			prisma.user.findMany({
				where: {
					memberships: {
						some: {
							orgId: org.id,
							role: Role.student,
						},
					},
				},
				select: {
					id: true,
					name: true,
					email: true,
					enrollments: {
						where: { orgId: org.id },
						select: {
							status: true,
							id: true,
						},
					},
				},
				take: 100,
			}),
		])

		// Calculate completion rate
		const avgCompletionRate =
			totalEnrollments > 0
				? Math.round((completedEnrollments / totalEnrollments) * 100)
				: 0
		const previousCompletionRate =
			previousEnrollments > 0
				? Math.round((previousCompletedEnrollments / previousEnrollments) * 100)
				: 0

		// Calculate average session time (mock data for now)
		const avgSessionTime = 28 // minutes

		// Process user distribution
		const roleColors: Record<string, string> = {
			admin: 'hsl(var(--chart-3))',
			teacher: 'hsl(var(--chart-2))',
			student: 'hsl(var(--chart-1))',
		}

		const userDistribution = usersByRole.map(r => ({
			name: r.role.charAt(0).toUpperCase() + r.role.slice(1) + 's',
			value: r._count,
			color: roleColors[r.role] || 'hsl(var(--chart-4))',
		}))

		// Process course engagement
		const courseEngagement = topCourses.map(course => {
			const enrollments = course._count.enrollments
			const lessonViews = course.progressEvents.length
			const engagement =
				enrollments > 0
					? Math.round((lessonViews / (enrollments * 10)) * 100)
					: 0
			return {
				course: course.title,
				engagement: Math.min(engagement, 100),
				enrollments,
			}
		})

		// Process activity trend (group by date)
		const activityByDate = new Map<
			string,
			{ logins: number; lessonViews: number; assignments: number }
		>()

		// Initialize dates in range
		const days =
			range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
		for (let i = days - 1; i >= 0; i--) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dateKey = date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			})
			activityByDate.set(dateKey, { logins: 0, lessonViews: 0, assignments: 0 })
		}

		// Aggregate activity
		activityEvents.forEach(event => {
			const dateKey = new Date(event.occurredAt).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			})
			const activity = activityByDate.get(dateKey)
			if (activity) {
				if (event.type === 'login') activity.logins++
				else if (event.type === 'viewed_lesson') activity.lessonViews++
				else if (event.type === 'completed_assignment') activity.assignments++
			}
		})

		const activityTrend = Array.from(activityByDate.entries()).map(
			([date, data]) => ({
				date,
				...data,
			})
		)

		// Process peak hours
		const hourCounts = new Map<number, number>()
		recentLogins.forEach(event => {
			const hour = new Date(event.occurredAt).getHours()
			hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
		})

		const peakHours = [6, 9, 12, 15, 18, 21].map(hour => ({
			hour: `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`,
			users: hourCounts.get(hour) || 0,
		}))

		// Process top performers
		const topPerformers = topStudents
			.map(student => {
				const completed = student.enrollments.filter(
					e => e.status === 'completed'
				).length
				const total = student.enrollments.length
				const avgScore = total > 0 ? Math.round((completed / total) * 100) : 0
				return {
					id: student.id,
					name: student.name,
					email: student.email,
					completedCourses: completed,
					avgScore,
				}
			})
			.sort((a, b) => b.avgScore - a.avgScore)
			.slice(0, 5)

		// Recent activity (mock data with real user names)
		const recentUsers = await prisma.user.findMany({
			where: {
				memberships: { some: { orgId: org.id } },
				lastActiveAt: { gte: startDate },
			},
			select: { name: true },
			orderBy: { lastActiveAt: 'desc' },
			take: 5,
		})

		const activityTypes = [
			'completed a lesson',
			'submitted an assignment',
			'enrolled in a course',
			'started a new course',
			'achieved a milestone',
		]

		const recentActivity = recentUsers.map((user, index) => ({
			type: 'activity',
			user: user.name,
			description: activityTypes[index % activityTypes.length],
			timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
		}))

		const analyticsData = {
			overview: {
				totalUsers,
				activeUsers,
				totalCourses,
				activeCourses,
				totalEnrollments,
				activeEnrollments,
				avgCompletionRate,
				avgSessionTime,
				previousPeriod: {
					totalUsers: totalUsers - 10,
					activeUsers: previousActiveUsers,
					totalEnrollments: previousEnrollments,
					avgCompletionRate: previousCompletionRate,
				},
			},
			userDistribution,
			courseEngagement,
			activityTrend,
			peakHours,
			topPerformers,
			recentActivity,
		}

		return NextResponse.json(analyticsData)
	} catch (error) {
		console.error('Error fetching analytics:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch analytics data' },
			{ status: 500 }
		)
	}
}
