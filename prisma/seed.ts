/// <reference types="node" />
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	const org = await prisma.organization.upsert({
		where: { slug: 'acme' },
		update: {},
		create: {
			slug: 'acme',
			name: 'Acme University',

			settings: { locale: 'en', timezone: 'UTC' },
			domains: { create: [{ domain: 'acme.example.com' }] },
		},
	})

	const passwordHash = await bcrypt.hash('Admin123!', 10)
	const user = await prisma.user.upsert({
		where: { email: 'admin@acme.edu' },
		update: {
			passwordHash: passwordHash,
		},
		create: {
			email: 'admin@acme.edu',
			name: 'Acme Admin',
			passwordHash: passwordHash,
		},
	})

	await prisma.membership.upsert({
		where: { orgId_userId: { orgId: org.id, userId: user.id } },
		update: { role: Role.admin },
		create: { orgId: org.id, userId: user.id, role: Role.admin },
	})

	console.log('Seeded organization and admin:', org.slug, user.email)
	console.log('Login credentials => email: admin@acme.edu password: Admin123!')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
