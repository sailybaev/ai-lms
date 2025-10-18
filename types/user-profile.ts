/**
 * User Profile Types
 * Type definitions for the user profile system
 */

export interface UserProfile {
	user: UserInfo
	membership: MembershipInfo
	stats: LearningStats
	enrollments: EnrollmentInfo[]
}

export interface UserInfo {
	id: string
	email: string
	name: string
	avatarUrl: string | null
	createdAt: Date
	lastActiveAt: Date | null
}

export interface MembershipInfo {
	role: 'admin' | 'teacher' | 'student'
	status: 'active' | 'invited' | 'suspended'
	org?: {
		id: string
		slug: string
		name: string
	}
}

export interface LearningStats {
	coursesEnrolled: number
	assignmentsCompleted: number
	lessonsViewed?: number
	aiUsage?: number
	totalActivity: number
}

export interface EnrollmentInfo {
	id: string
	courseId: string
	courseTitle: string
	courseDescription?: string | null
	courseThumbnail?: string | null
	status: 'active' | 'completed' | 'dropped'
}

export interface ActivityEvent {
	id: string
	type: 'viewed_lesson' | 'completed_assignment' | 'login' | 'ai_usage'
	courseTitle?: string | null
	lessonTitle?: string | null
	metadata?: any
	occurredAt: Date
}

export interface ProfileUpdateData {
	name?: string
	avatarUrl?: string | null
}

export interface ValidationResult {
	valid: boolean
	errors: string[]
}

export interface APIResponse<T = any> {
	success?: boolean
	error?: string
	errors?: string[]
	data?: T
	message?: string
}

export interface ProfileAPIResponse extends APIResponse {
	user?: UserInfo
}
