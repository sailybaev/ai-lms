import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { mkdir, writeFile } from 'fs/promises'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { join } from 'path'

// POST: Upload profile photo for a student (admin only)
export async function POST(
	request: Request,
	{ params }: { params: { org: string } }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const orgSlug = params.org

		// Verify organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Verify user is admin in this org
		const adminUser = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				memberships: {
					where: {
						orgId: organization.id,
						role: 'admin',
					},
				},
			},
		})

		if (!adminUser || adminUser.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an organization admin to upload photos' },
				{ status: 403 }
			)
		}

		// Get form data
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		// Validate file type
		const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		if (!validTypes.includes(file.type)) {
			return NextResponse.json(
				{
					error:
						'Invalid file type. Please upload a PNG, JPG, GIF, or WebP image',
				},
				{ status: 400 }
			)
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'File too large. Maximum size is 5MB' },
				{ status: 400 }
			)
		}

		// Create upload directory if it doesn't exist
		const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
		try {
			await mkdir(uploadDir, { recursive: true })
		} catch (error) {
			// Directory might already exist
		}

		// Generate unique filename
		const timestamp = Date.now()
		const ext = file.name.split('.').pop()
		const filename = `${timestamp}-${Math.random()
			.toString(36)
			.substring(7)}.${ext}`
		const filepath = join(uploadDir, filename)

		// Write file to disk
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		await writeFile(filepath, buffer)

		// Generate URL
		const avatarUrl = `/uploads/avatars/${filename}`

		return NextResponse.json({
			message: 'Photo uploaded successfully',
			avatarUrl,
		})
	} catch (error) {
		console.error('Error uploading photo:', error)
		return NextResponse.json(
			{ error: 'Failed to upload photo' },
			{ status: 500 }
		)
	}
}
