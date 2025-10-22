'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import { BarChart3, FileText, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Course = {
	id: string
	title: string
	description: string | null
	thumbnailUrl: string | null
	status: string
	students: number
	lessons: number
	enrollmentCount: number
	createdAt: string
}

export default function CoursesPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)

	const fetchCourses = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			const response = await fetch(`/api/org/${orgSlug}/teacher/courses`)
			if (!response.ok) {
				throw new Error('Failed to fetch courses')
			}
			const data = await response.json()
			setCourses(data.courses)
		} catch (error) {
			console.error('Error fetching courses:', error)
			toast({
				title: 'Error',
				description: 'Failed to load courses. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCourses()
	}, [orgSlug])

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'active':
				return 'bg-green-500/10 text-green-500'
			case 'draft':
				return 'bg-yellow-500/10 text-yellow-500'
			case 'archived':
				return 'bg-gray-500/10 text-gray-500'
			default:
				return 'bg-blue-500/10 text-blue-500'
		}
	}
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Courses</h1>
					<p className='text-muted-foreground mt-1'>
						View and manage your assigned courses
					</p>
				</div>
			</div>

			{loading ? (
				<div className='text-center py-12 text-muted-foreground'>
					Loading courses...
				</div>
			) : courses.length === 0 ? (
				<Card className='p-12'>
					<div className='text-center space-y-3'>
						<div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto'>
							<FileText className='w-8 h-8 text-primary' />
						</div>
						<h3 className='text-lg font-semibold'>No courses assigned</h3>
						<p className='text-muted-foreground max-w-md mx-auto'>
							You don't have any courses assigned yet. Contact your
							administrator to be assigned to courses.
						</p>
					</div>
				</Card>
			) : (
				<div className='grid gap-6'>
					{courses.map(course => (
						<Card
							key={course.id}
							className='p-6 hover:border-primary/50 transition-colors'
						>
							<div className='space-y-4'>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex-1'>
										<h3 className='text-xl font-semibold'>{course.title}</h3>
										<p className='text-sm text-muted-foreground mt-1'>
											{course.description || 'No description provided'}
										</p>
									</div>
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
											course.status
										)}`}
									>
										{course.status.charAt(0).toUpperCase() +
											course.status.slice(1)}
									</span>
								</div>

								<div className='flex flex-wrap items-center gap-6 text-sm'>
									<div className='flex items-center gap-2'>
										<Users className='w-4 h-4 text-muted-foreground' />
										<span className='font-medium'>{course.students}</span>
										<span className='text-muted-foreground'>students</span>
									</div>
									<div className='flex items-center gap-2'>
										<FileText className='w-4 h-4 text-muted-foreground' />
										<span className='font-medium'>{course.lessons}</span>
										<span className='text-muted-foreground'>lessons</span>
									</div>
								</div>

								<div className='flex gap-2 pt-2'>
									<Button asChild variant='default' size='sm'>
										<Link href={`/${orgSlug}/teacher/courses/${course.id}`}>
											Open Course
										</Link>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='gap-2 bg-transparent'
									>
										<BarChart3 className='w-4 h-4' />
										Analytics
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='gap-2 bg-transparent'
									>
										<Settings className='w-4 h-4' />
										Settings
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
