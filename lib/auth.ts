import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from './db'

export async function requireAuth() {
	const session = await getServerSession(authOptions as any)
	return session
}

/**
 * Get the user's role within a specific organization
 */
export async function getUserOrgRole(
	userEmail: string,
	orgSlug: string
): Promise<Role | null> {
	const org = await prisma.organization.findUnique({
		where: { slug: orgSlug },
	})

	if (!org) return null

	const user = await prisma.user.findUnique({
		where: { email: userEmail },
		include: {
			memberships: {
				where: {
					orgId: org.id,
					status: 'active',
				},
			},
		},
	})

	if (!user || user.memberships.length === 0) return null

	return user.memberships[0].role
}

/**
 * Require a specific role within an organization
 * Redirects to appropriate page if user doesn't have required role
 */
export async function requireOrgRole(
	orgSlug: string,
	allowedRoles: Role[]
): Promise<{ role: Role; email: string }> {
	const session = (await getServerSession(authOptions as any)) as any

	if (!session?.user?.email) {
		redirect(`/${orgSlug}/login`)
	}

	const role = await getUserOrgRole(session.user.email, orgSlug)

	if (!role || !allowedRoles.includes(role)) {
		// Redirect based on their actual role
		if (role === 'student') {
			redirect(`/${orgSlug}/student`)
		} else if (role === 'teacher') {
			redirect(`/${orgSlug}/teacher`)
		} else if (role === 'admin') {
			redirect(`/${orgSlug}/admin`)
		} else {
			redirect(`/${orgSlug}/login`)
		}
	}

	return { role, email: session.user.email }
}
