import { prisma } from './db'

/**
 * Get user profile with membership and stats for a specific organization
 */
export async function getUserProfile(userEmail: string, orgSlug: string) {
	const user = await prisma.user.findUnique({
		where: { email: userEmail },
		include: {
			memberships: {
				where: {
					org: {
						slug: orgSlug,
					},
					status: 'active',
				},
				include: {
					org: {
						select: {
							id: true,
							slug: true,
							name: true,
						},
					},
				},
			},
			enrollments: {
				where: {
					org: {
						slug: orgSlug,
					},
					status: 'active',
				},
				include: {
					course: {
						select: {
							id: true,
							title: true,
							description: true,
							thumbnailUrl: true,
							status: true,
						},
					},
				},
			},
		},
	})

	if (!user || user.memberships.length === 0) {
		return null
	}

	const orgId = user.memberships[0].org.id

	// Get learning stats
	const [progressCount, assignmentsCompleted, lessonsViewed, aiUsage] =
		await Promise.all([
			prisma.progressEvent.count({
				where: {
					userId: user.id,
					orgId,
				},
			}),
			prisma.progressEvent.count({
				where: {
					userId: user.id,
					orgId,
					type: 'completed_assignment',
				},
			}),
			prisma.progressEvent.count({
				where: {
					userId: user.id,
					orgId,
					type: 'viewed_lesson',
				},
			}),
			prisma.progressEvent.count({
				where: {
					userId: user.id,
					orgId,
					type: 'ai_usage',
				},
			}),
		])

	return {
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			avatarUrl: user.avatarUrl,
			createdAt: user.createdAt,
			lastActiveAt: user.lastActiveAt,
		},
		membership: {
			role: user.memberships[0].role,
			status: user.memberships[0].status,
			org: user.memberships[0].org,
		},
		stats: {
			coursesEnrolled: user.enrollments.length,
			assignmentsCompleted,
			lessonsViewed,
			aiUsage,
			totalActivity: progressCount,
		},
		enrollments: user.enrollments.map(e => ({
			id: e.id,
			courseId: e.course.id,
			courseTitle: e.course.title,
			courseDescription: e.course.description,
			courseThumbnail: e.course.thumbnailUrl,
			status: e.status,
		})),
	}
}

/**
 * Update user profile information
 */
export async function updateUserProfile(
	userEmail: string,
	data: {
		name?: string
		avatarUrl?: string | null
	}
) {
	const updateData: any = {
		lastActiveAt: new Date(),
	}

	if (data.name !== undefined) {
		if (typeof data.name !== 'string' || data.name.trim().length === 0) {
			throw new Error('Invalid name')
		}
		updateData.name = data.name.trim()
	}

	if (data.avatarUrl !== undefined) {
		if (data.avatarUrl !== null && typeof data.avatarUrl !== 'string') {
			throw new Error('Invalid avatar URL')
		}
		updateData.avatarUrl = data.avatarUrl
	}

	const updatedUser = await prisma.user.update({
		where: { email: userEmail },
		data: updateData,
		select: {
			id: true,
			email: true,
			name: true,
			avatarUrl: true,
			createdAt: true,
			lastActiveAt: true,
		},
	})

	return updatedUser
}

/**
 * Check if user is a member of an organization
 */
export async function checkUserMembership(userEmail: string, orgSlug: string) {
	const membership = await prisma.membership.findFirst({
		where: {
			user: {
				email: userEmail,
			},
			org: {
				slug: orgSlug,
			},
			status: 'active',
		},
		include: {
			org: {
				select: {
					id: true,
					slug: true,
					name: true,
				},
			},
		},
	})

	return membership
}

/**
 * Get user's recent activity in an organization
 */
export async function getUserActivity(
	userId: string,
	orgId: string,
	limit: number = 10
) {
	const activities = await prisma.progressEvent.findMany({
		where: {
			userId,
			orgId,
		},
		orderBy: {
			occurredAt: 'desc',
		},
		take: limit,
		include: {
			course: {
				select: {
					title: true,
				},
			},
			lesson: {
				select: {
					title: true,
				},
			},
		},
	})

	return activities.map(activity => ({
		id: activity.id,
		type: activity.type,
		courseTitle: activity.course?.title,
		lessonTitle: activity.lesson?.title,
		metadata: activity.metadata,
		occurredAt: activity.occurredAt,
	}))
}

/**
 * Validate profile update data
 */
export function validateProfileUpdate(data: any) {
	const errors: string[] = []

	if (data.name !== undefined) {
		if (typeof data.name !== 'string') {
			errors.push('Name must be a string')
		} else if (data.name.trim().length === 0) {
			errors.push('Name cannot be empty')
		} else if (data.name.length > 100) {
			errors.push('Name must be less than 100 characters')
		}
	}

	if (data.avatarUrl !== undefined && data.avatarUrl !== null) {
		if (typeof data.avatarUrl !== 'string') {
			errors.push('Avatar URL must be a string')
		} else if (data.avatarUrl.length > 500) {
			errors.push('Avatar URL must be less than 500 characters')
		}
		// Basic URL validation
		else if (data.avatarUrl.length > 0) {
			try {
				new URL(data.avatarUrl)
			} catch {
				errors.push('Invalid avatar URL format')
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	}
}
