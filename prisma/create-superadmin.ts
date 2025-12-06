/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	const email = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com'
	const password = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!'
	const name = process.env.SUPERADMIN_NAME || 'Super Admin'

	console.log('Creating super admin account...')
	console.log('Email:', email)

	// Check if user already exists
	const existing = await prisma.user.findUnique({
		where: { email },
	})

	if (existing) {
		// Update existing user to be super admin
		await prisma.user.update({
			where: { email },
			data: { isSuperAdmin: true },
		})
		console.log('✅ Existing user updated to super admin')
	} else {
		// Create new super admin
		const passwordHash = await bcrypt.hash(password, 10)

		await prisma.user.create({
			data: {
				email,
				name,
				passwordHash,
				isSuperAdmin: true,
			},
		})
		console.log('✅ Super admin account created successfully!')
		console.log('Password:', password)
		console.log('\n⚠️  Please change the password after first login')
	}
}

main()
	.catch(e => {
		console.error('❌ Error:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
