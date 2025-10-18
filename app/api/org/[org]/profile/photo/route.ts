import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { writeFile } from 'fs/promises'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import path from 'path'

// POST: Upload profile photo
export async function POST(
	request: Request,
	{ params }: { params: { org: string } }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return NextResponse.json(
				{ error: 'File must be an image' },
				{ status: 400 }
			)
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'File size must be less than 5MB' },
				{ status: 400 }
			)
		}

		// Get user
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { id: true },
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		// Generate unique filename
		const timestamp = Date.now()
		const extension = file.name.split('.').pop()
		const filename = `${user.id}_${timestamp}.${extension}`

		// Save file to public/uploads directory
		const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
		const filepath = path.join(uploadDir, filename)

		// Ensure directory exists
		try {
			await writeFile(filepath, buffer)
		} catch (error) {
			// If directory doesn't exist, try to create it
			const fs = require('fs')
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true })
			}
			await writeFile(filepath, buffer)
		}

		// Create public URL
		const avatarUrl = `/uploads/avatars/${filename}`

		// Update user avatar URL
		await prisma.user.update({
			where: { id: user.id },
			data: { avatarUrl },
		})

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
