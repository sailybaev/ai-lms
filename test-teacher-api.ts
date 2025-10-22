// Quick test script to verify the teacher students API
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
	console.log('Testing teacher students API logic...\n')

	// Get the organization
	const org = await prisma.organization.findUnique({
		where: { slug: 'acme' },
	})

	if (!org) {
		console.error('Organization not found!')
		return
	}

	console.log('✓ Organization found:', org.name)

	// Get the teacher
	const teacher = await prisma.user.findUnique({
		where: { email: 'teacher@acme.edu' },
		include: {
			memberships: {
				where: {
					orgId: org.id,
					role: 'teacher',
				},
			},
		},
	})

	if (!teacher || teacher.memberships.length === 0) {
		console.error('Teacher not found or not a teacher in org!')
		return
	}

	console.log('✓ Teacher found:', teacher.name)
	console.log('  Membership role:', teacher.memberships[0].role)

	// Get teacher's courses
	const teacherCourses = await prisma.course.findMany({
		where: {
			orgId: org.id,
			OR: [
				{ createdById: teacher.id },
				{
					instructors: {
						some: {
							userId: teacher.id,
						},
					},
				},
			],
		},
	})

	console.log('✓ Courses found:', teacherCourses.length)
	teacherCourses.forEach(course => {
		console.log(`  - ${course.title}`)
	})

	const courseIds = teacherCourses.map(c => c.id)

	// Get enrollments
	const enrollments = await prisma.enrollment.findMany({
		where: {
			courseId: {
				in: courseIds,
			},
			status: 'active',
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			course: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	})

	console.log('✓ Enrollments found:', enrollments.length)
	enrollments.forEach(enrollment => {
		console.log(
			`  - ${enrollment.user.name} enrolled in ${enrollment.course.title}`
		)
	})

	// Get unique students
	const studentIds = [...new Set(enrollments.map(e => e.user.id))]
	console.log('✓ Unique students:', studentIds.length)

	console.log('\n✅ API should work correctly!')
}

test()
	.catch(e => {
		console.error('Error:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
