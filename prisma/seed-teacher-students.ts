/// <reference types="node" />
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	// Get or create organization
	const org = await prisma.organization.upsert({
		where: { slug: 'acme' },
		update: {},
		create: {
			slug: 'acme',
			name: 'Acme University',
			platformName: 'Acme Learning Platform',
			settings: { locale: 'en', timezone: 'UTC' },
		},
	})

	console.log('Organization:', org.slug)

	// Create a teacher
	const teacherPasswordHash = await bcrypt.hash('Teacher123!', 10)
	const teacher = await prisma.user.upsert({
		where: { email: 'teacher@acme.edu' },
		update: {
			passwordHash: teacherPasswordHash,
		},
		create: {
			email: 'teacher@acme.edu',
			name: 'John Teacher',
			passwordHash: teacherPasswordHash,
		},
	})

	// Create teacher membership
	await prisma.membership.upsert({
		where: { orgId_userId: { orgId: org.id, userId: teacher.id } },
		update: { role: Role.teacher },
		create: { orgId: org.id, userId: teacher.id, role: Role.teacher },
	})

	console.log('Teacher created:', teacher.email)

	// Create 3 students
	const studentData = [
		{ email: 'student1@acme.edu', name: 'Alice Student' },
		{ email: 'student2@acme.edu', name: 'Bob Student' },
		{ email: 'student3@acme.edu', name: 'Charlie Student' },
	]

	const students = []
	const studentPasswordHash = await bcrypt.hash('Student123!', 10)

	for (const data of studentData) {
		const student = await prisma.user.upsert({
			where: { email: data.email },
			update: {
				passwordHash: studentPasswordHash,
			},
			create: {
				email: data.email,
				name: data.name,
				passwordHash: studentPasswordHash,
			},
		})

		await prisma.membership.upsert({
			where: { orgId_userId: { orgId: org.id, userId: student.id } },
			update: { role: Role.student },
			create: { orgId: org.id, userId: student.id, role: Role.student },
		})

		students.push(student)
		console.log('Student created:', student.email)
	}

	// Create 2 courses for the teacher
	const course1 = await prisma.course.create({
		data: {
			orgId: org.id,
			title: 'Introduction to Web Development',
			description: 'Learn the basics of HTML, CSS, and JavaScript',
			status: 'active',
			createdById: teacher.id,
		},
	})

	const course2 = await prisma.course.create({
		data: {
			orgId: org.id,
			title: 'Advanced React Programming',
			description: 'Master React hooks, context, and advanced patterns',
			status: 'active',
			createdById: teacher.id,
		},
	})

	console.log('Courses created:', course1.title, course2.title)

	// Enroll students in courses
	// Alice in both courses
	await prisma.enrollment.upsert({
		where: {
			courseId_userId: { courseId: course1.id, userId: students[0].id },
		},
		update: {},
		create: {
			orgId: org.id,
			courseId: course1.id,
			userId: students[0].id,
			status: 'active',
		},
	})

	await prisma.enrollment.upsert({
		where: {
			courseId_userId: { courseId: course2.id, userId: students[0].id },
		},
		update: {},
		create: {
			orgId: org.id,
			courseId: course2.id,
			userId: students[0].id,
			status: 'active',
		},
	})

	// Bob in course 1 only
	await prisma.enrollment.upsert({
		where: {
			courseId_userId: { courseId: course1.id, userId: students[1].id },
		},
		update: {},
		create: {
			orgId: org.id,
			courseId: course1.id,
			userId: students[1].id,
			status: 'active',
		},
	})

	// Charlie in course 2 only
	await prisma.enrollment.upsert({
		where: {
			courseId_userId: { courseId: course2.id, userId: students[2].id },
		},
		update: {},
		create: {
			orgId: org.id,
			courseId: course2.id,
			userId: students[2].id,
			status: 'active',
		},
	})

	console.log('Enrollments created')

	// Create some sections and lessons for course progress
	const section1 = await prisma.courseSection.create({
		data: {
			courseId: course1.id,
			title: 'Getting Started',
			position: 1,
		},
	})

	const lesson1 = await prisma.lesson.create({
		data: {
			sectionId: section1.id,
			title: 'Introduction to HTML',
			content: {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'Welcome to HTML!' }],
					},
				],
			},
			position: 1,
			duration: 30,
		},
	})

	const lesson2 = await prisma.lesson.create({
		data: {
			sectionId: section1.id,
			title: 'CSS Basics',
			content: {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'Learn CSS styling' }],
					},
				],
			},
			position: 2,
			duration: 45,
		},
	})

	console.log('Sections and lessons created')

	// Add some progress for students
	await prisma.progressEvent.create({
		data: {
			orgId: org.id,
			userId: students[0].id,
			courseId: course1.id,
			lessonId: lesson1.id,
			type: 'viewed_lesson',
		},
	})

	await prisma.progressEvent.create({
		data: {
			orgId: org.id,
			userId: students[1].id,
			courseId: course1.id,
			lessonId: lesson1.id,
			type: 'viewed_lesson',
		},
	})

	console.log('Progress events created')

	console.log('\n=== Seed Complete ===')
	console.log('Teacher login: teacher@acme.edu / Teacher123!')
	console.log('Student logins:')
	console.log('  - student1@acme.edu / Student123! (enrolled in both courses)')
	console.log('  - student2@acme.edu / Student123! (enrolled in course 1)')
	console.log('  - student3@acme.edu / Student123! (enrolled in course 2)')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
