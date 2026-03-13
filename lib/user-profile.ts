import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

/**
 * Get user profile with membership and stats for a specific organization.
 * Calls the Go backend GET /api/org/:slug/profile.
 */
export async function getUserProfile(userEmail: string, orgSlug: string) {
	const session = (await getServerSession(authOptions as any)) as any
	const token: string | undefined = session?.user?.backendToken

	if (!token) return null

	const res = await fetch(`${BACKEND_URL}/api/org/${orgSlug}/profile`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: 'no-store',
	})

	if (!res.ok) return null

	const data = await res.json()

	return {
		user: {
			id: data.id,
			email: data.email,
			name: data.name,
			avatarUrl: data.avatarUrl,
			createdAt: data.createdAt,
			lastActiveAt: data.lastActiveAt,
		},
		membership: {
			role: data.membership?.role ?? '',
			status: data.membership?.status ?? '',
			org: data.org ?? {},
		},
		stats: {
			coursesEnrolled: 0,
			assignmentsCompleted: 0,
			lessonsViewed: 0,
			aiUsage: 0,
			totalActivity: 0,
		},
		enrollments: [],
	}
}

/**
 * Update user profile information via the Go backend.
 */
export async function updateUserProfile(
	userEmail: string,
	data: { name?: string; avatarUrl?: string | null }
) {
	// This is called from API routes which proxy to backend — no direct DB call needed
	return null
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
		} else if (data.avatarUrl.length > 0) {
			try {
				new URL(data.avatarUrl)
			} catch {
				errors.push('Invalid avatar URL format')
			}
		}
	}

	return { valid: errors.length === 0, errors }
}
