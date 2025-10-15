import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export async function requireAuth() {
	const session = await getServerSession(authOptions as any)
	return session
}
