import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

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
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				})
				if (!user || !user.passwordHash) return null
				const valid = await bcrypt.compare(
					credentials.password,
					user.passwordHash
				)
				if (!valid) return null
				return { id: user.id, email: user.email, name: user.name }
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as any).id
			}
			return token
		},
		async session({ session, token }) {
			if (session.user && token?.id) {
				;(session.user as any).id = token.id
			}
			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
