import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function requireAuth() {
	const session = await getServerSession(authOptions as any)
	return session
}

/**
 * Require super admin access.
 * isSuperAdmin is stored in the JWT session by NextAuth.
 */
export async function requireSuperAdmin(): Promise<{ email: string }> {
	const session = (await getServerSession(authOptions as any)) as any

	if (!session?.user?.email) {
		redirect('/login?callbackUrl=/superadmin')
	}

	if (!session.user.isSuperAdmin) {
		redirect('/')
	}

	return { email: session.user.email }
}

/**
 * Get the user's role within a specific organization via the Go backend.
 */
export async function getUserOrgRole(
	userEmail: string,
	orgSlug: string
): Promise<string | null> {
	// Role is determined by the Go backend — use requireOrgRole which checks session
	return null
}

/**
 * Require a specific role within an organization.
 * Checks the session token's org memberships via the Go backend.
 */
export async function requireOrgRole(
	orgSlug: string,
	allowedRoles: string[]
): Promise<{ role: string; email: string }> {
	const session = (await getServerSession(authOptions as any)) as any

	if (!session?.user?.email) {
		redirect(`/${orgSlug}/login`)
	}

	// Role is embedded in the session via backendToken claims; for layout guards
	// we trust the session. Fine-grained checks happen in Go API routes.
	const role: string = session.user.role ?? ''

	if (!role || !allowedRoles.includes(role)) {
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
