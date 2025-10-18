/**
 * User management utilities for admin operations
 */

import { MembershipStatus, Role } from '@prisma/client'

export type UserWithMembership = {
	id: string
	name: string
	email: string
	avatarUrl: string | null
	createdAt: Date
	lastActiveAt: Date | null
	memberships: Array<{
		id: string
		role: Role
		status: MembershipStatus
		org: {
			id: string
			name: string
			slug: string
		}
	}>
}

export type UpdateUserPayload = {
	name?: string
	email?: string
	avatarUrl?: string | null
}

export type UpdateMembershipPayload = {
	orgId: string
	role?: Role
	status?: MembershipStatus
}

/**
 * Fetch all users with optional filtering
 */
export async function fetchUsers(params?: {
	role?: string
	status?: string
	search?: string
	orgId?: string
}): Promise<UserWithMembership[]> {
	const queryParams = new URLSearchParams()

	if (params?.role) queryParams.append('role', params.role)
	if (params?.status) queryParams.append('status', params.status)
	if (params?.search) queryParams.append('search', params.search)
	if (params?.orgId) queryParams.append('orgId', params.orgId)

	const response = await fetch(`/api/admin/users?${queryParams.toString()}`)

	if (!response.ok) {
		throw new Error('Failed to fetch users')
	}

	return response.json()
}

/**
 * Fetch a single user by ID
 */
export async function fetchUser(userId: string): Promise<UserWithMembership> {
	const response = await fetch(`/api/admin/users/${userId}`)

	if (!response.ok) {
		throw new Error('Failed to fetch user')
	}

	return response.json()
}

/**
 * Create a new user
 */
export async function createUser(data: {
	name: string
	email: string
	role: string
	orgId: string
}): Promise<UserWithMembership> {
	const response = await fetch('/api/admin/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Failed to create user')
	}

	return response.json()
}

/**
 * Update user information
 */
export async function updateUser(
	userId: string,
	data: UpdateUserPayload
): Promise<UserWithMembership> {
	const response = await fetch(`/api/admin/users/${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Failed to update user')
	}

	return response.json()
}

/**
 * Update user membership (role and status)
 */
export async function updateUserMembership(
	userId: string,
	data: UpdateMembershipPayload
): Promise<any> {
	const response = await fetch(`/api/admin/users/${userId}/membership`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Failed to update membership')
	}

	return response.json()
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
	const response = await fetch(`/api/admin/users/${userId}`, {
		method: 'DELETE',
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Failed to delete user')
	}
}

/**
 * Format user role for display
 */
export function formatRole(role: string): string {
	return role.charAt(0).toUpperCase() + role.slice(1)
}

/**
 * Get role badge variant
 */
export function getRoleBadgeVariant(
	role: string
): 'default' | 'secondary' | 'outline' {
	switch (role.toLowerCase()) {
		case 'admin':
			return 'default'
		case 'teacher':
			return 'secondary'
		case 'student':
			return 'outline'
		default:
			return 'outline'
	}
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
	switch (status.toLowerCase()) {
		case 'active':
			return 'bg-green-500/10 text-green-500'
		case 'suspended':
			return 'bg-red-500/10 text-red-500'
		case 'invited':
			return 'bg-yellow-500/10 text-yellow-500'
		default:
			return 'bg-gray-500/10 text-gray-500'
	}
}
