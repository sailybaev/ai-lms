import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET: List all groups (admin view)
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const { searchParams } = new URL(request.url)
		const courseId = searchParams.get('courseId')

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

		// Verify user is an admin in this org
		const user = await prisma.user.findUnique({
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

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{ error: 'You must be an admin in this organization' },
				{ status: 403 }
			)
		}

		// Build where clause
		const where: any = {
			orgId: organization.id,
		}

		// If courseId is provided, filter by course
		if (courseId) {
			where.courseId = courseId
		}

		// Fetch groups
		const groups = await prisma.group.findMany({
			where,
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
				assignedTeacher: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
				},
			},
			orderBy: {
				name: 'asc',
			},
		})

		// Format response
		const formattedGroups = groups.map((group: any) => ({
			id: group.id,
			name: group.name,
			description: group.description,
			courseId: group.courseId,
			courseName: group.course?.title,
			assignedTeacherId: group.assignedTeacherId,
			assignedTeacher: group.assignedTeacher,
			members: group.members.map((m: any) => ({
				id: m.user.id,
				name: m.user.name,
				email: m.user.email,
				avatarUrl: m.user.avatarUrl,
			})),
		}))

		return NextResponse.json({ groups: formattedGroups })
	} catch (error) {
		console.error('Error fetching groups:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch groups' },
			{ status: 500 }
		)
	}
}

// POST: Create a new group (admin only)
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const body = await request.json()
		const { name, description, courseId, assignedTeacherId, memberIds } = body

		if (!name) {
			return NextResponse.json(
				{ error: 'Group name is required' },
				{ status: 400 }
			)
		}

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

		// Verify user is an admin in this org
		const user = await prisma.user.findUnique({
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

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{
					error: 'You must be an admin in this organization to create groups',
				},
				{ status: 403 }
			)
		}

		// If courseId is provided, verify the course exists
		if (courseId) {
			const course = await prisma.course.findFirst({
				where: {
					id: courseId,
					orgId: organization.id,
				},
			})

			if (!course) {
				return NextResponse.json(
					{ error: 'Course not found in this organization' },
					{ status: 404 }
				)
			}
		}

		// If assignedTeacherId is provided, verify the teacher exists
		if (assignedTeacherId) {
			const teacher = await prisma.user.findFirst({
				where: {
					id: assignedTeacherId,
					memberships: {
						some: {
							orgId: organization.id,
							role: 'teacher',
						},
					},
				},
			})

			if (!teacher) {
				return NextResponse.json(
					{ error: 'Teacher not found in this organization' },
					{ status: 404 }
				)
			}
		}

		// Create the group
		const group = await prisma.group.create({
			data: {
				orgId: organization.id,
				courseId: courseId || null,
				assignedTeacherId: assignedTeacherId || null,
				name,
				description: description || null,
			},
		})

		// Add members if provided
		if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
			await prisma.groupMember.createMany({
				data: memberIds.map((userId: string) => ({
					groupId: group.id,
					userId,
				})),
				skipDuplicates: true,
			})
		}

		// Fetch the complete group with members
		const completeGroup = await prisma.group.findUnique({
			where: { id: group.id },
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
				assignedTeacher: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
				},
			},
		})

		return NextResponse.json(
			{
				message: 'Group created successfully',
				group: {
					id: completeGroup?.id,
					name: completeGroup?.name,
					description: completeGroup?.description,
					courseId: completeGroup?.courseId,
					courseName: completeGroup?.course?.title,
					assignedTeacherId: completeGroup?.assignedTeacherId,
					assignedTeacher: completeGroup?.assignedTeacher,
					members:
						completeGroup?.members.map((m: any) => ({
							id: m.user.id,
							name: m.user.name,
							email: m.user.email,
							avatarUrl: m.user.avatarUrl,
						})) || [],
				},
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating group:', error)
		return NextResponse.json(
			{ error: 'Failed to create group' },
			{ status: 500 }
		)
	}
}

// PUT: Update group information (admin only)
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const body = await request.json()
		const {
			groupId,
			name,
			description,
			courseId,
			assignedTeacherId,
			memberIds,
		} = body

		if (!groupId) {
			return NextResponse.json(
				{ error: 'Group ID is required' },
				{ status: 400 }
			)
		}

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

		// Verify user is an admin in this org
		const user = await prisma.user.findUnique({
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

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{
					error: 'You must be an admin in this organization to update groups',
				},
				{ status: 403 }
			)
		}

		// Verify group exists and belongs to this org
		const group = await prisma.group.findFirst({
			where: {
				id: groupId,
				orgId: organization.id,
			},
		})

		if (!group) {
			return NextResponse.json(
				{ error: 'Group not found in this organization' },
				{ status: 404 }
			)
		}

		// Update the group
		const updateData: any = {}
		if (name !== undefined) updateData.name = name
		if (description !== undefined) updateData.description = description
		if (courseId !== undefined) updateData.courseId = courseId
		if (assignedTeacherId !== undefined)
			updateData.assignedTeacherId = assignedTeacherId

		const updatedGroup = await prisma.group.update({
			where: { id: groupId },
			data: updateData,
		})

		// Update members if provided
		if (memberIds !== undefined && Array.isArray(memberIds)) {
			// Remove all existing members
			await prisma.groupMember.deleteMany({
				where: { groupId },
			})

			// Add new members
			if (memberIds.length > 0) {
				await prisma.groupMember.createMany({
					data: memberIds.map((userId: string) => ({
						groupId,
						userId,
					})),
					skipDuplicates: true,
				})
			}
		}

		// Fetch the complete group with members
		const completeGroup = await prisma.group.findUnique({
			where: { id: groupId },
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
				assignedTeacher: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
				},
			},
		})

		return NextResponse.json({
			message: 'Group updated successfully',
			group: {
				id: completeGroup?.id,
				name: completeGroup?.name,
				description: completeGroup?.description,
				courseId: completeGroup?.courseId,
				courseName: completeGroup?.course?.title,
				assignedTeacherId: completeGroup?.assignedTeacherId,
				assignedTeacher: completeGroup?.assignedTeacher,
				members:
					completeGroup?.members.map((m: any) => ({
						id: m.user.id,
						name: m.user.name,
						email: m.user.email,
						avatarUrl: m.user.avatarUrl,
					})) || [],
			},
		})
	} catch (error) {
		console.error('Error updating group:', error)
		return NextResponse.json(
			{ error: 'Failed to update group' },
			{ status: 500 }
		)
	}
}

// DELETE: Delete a group (admin only)
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ org: string }> }
) {
	try {
		const session = (await getServerSession(authOptions as any)) as any
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { org } = await params
		const orgSlug = org
		const { searchParams } = new URL(request.url)
		const groupId = searchParams.get('groupId')

		if (!groupId) {
			return NextResponse.json(
				{ error: 'Group ID is required' },
				{ status: 400 }
			)
		}

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

		// Verify user is an admin in this org
		const user = await prisma.user.findUnique({
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

		if (!user || user.memberships.length === 0) {
			return NextResponse.json(
				{
					error: 'You must be an admin in this organization to delete groups',
				},
				{ status: 403 }
			)
		}

		// Verify group exists and belongs to this org
		const group = await prisma.group.findFirst({
			where: {
				id: groupId,
				orgId: organization.id,
			},
		})

		if (!group) {
			return NextResponse.json(
				{ error: 'Group not found in this organization' },
				{ status: 404 }
			)
		}

		// Delete the group (cascade will handle members)
		await prisma.group.delete({
			where: { id: groupId },
		})

		return NextResponse.json({
			message: 'Group deleted successfully',
		})
	} catch (error) {
		console.error('Error deleting group:', error)
		return NextResponse.json(
			{ error: 'Failed to delete group' },
			{ status: 500 }
		)
	}
}
