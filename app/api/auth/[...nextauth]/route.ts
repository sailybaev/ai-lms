import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8080'

export const authOptions = {
	session: { strategy: 'jwt' as const },
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null

				try {
					const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					})
					if (!res.ok) return null

					const data = await res.json()
					return {
						id: data.user.id,
						email: data.user.email,
						name: data.user.name,
						isSuperAdmin: data.user.isSuperAdmin,
						backendToken: data.token,
					}
				} catch {
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id
				token.isSuperAdmin = user.isSuperAdmin
				token.backendToken = user.backendToken
			}
			return token
		},
		async session({ session, token }: any) {
			if (session.user) {
				session.user.id = token.id
				session.user.isSuperAdmin = token.isSuperAdmin
				session.user.backendToken = token.backendToken
			}
			return session
		},
	},
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
