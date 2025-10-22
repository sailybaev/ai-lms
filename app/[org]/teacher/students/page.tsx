'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import { Mail, MessageSquare, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Course {
	id: string
	title: string
	progress: number
	grade: string
	averageScore: number | null
}

interface Student {
	id: string
	name: string
	email: string
	avatarUrl: string | null
	lastActive: string
	courses: Course[]
}

export default function StudentsPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [students, setStudents] = useState<Student[]>([])
	const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
	const [loading, setLoading] = useState(true)
	const [courseFilter, setCourseFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		if (orgSlug) {
			fetchStudents()
			fetchCourses()
		}
	}, [orgSlug])

	const fetchStudents = async () => {
		try {
			setLoading(true)
			const res = await fetch(`/api/org/${orgSlug}/teacher/students`)
			if (!res.ok) throw new Error('Failed to fetch students')
			const data = await res.json()
			setStudents(data.students || [])
		} catch (error) {
			console.error('Error fetching students:', error)
			toast({
				title: 'Error',
				description: 'Failed to load students',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const fetchCourses = async () => {
		try {
			const res = await fetch(`/api/org/${orgSlug}/teacher/courses`)
			if (!res.ok) throw new Error('Failed to fetch courses')
			const data = await res.json()
			setCourses(
				data.courses.map((c: any) => ({
					id: c.id,
					title: c.title,
				}))
			)
		} catch (error) {
			console.error('Error fetching courses:', error)
		}
	}

	// Flatten students by course for filtering
	const studentCourseEntries = students.flatMap(student =>
		student.courses.map(course => ({
			student,
			course,
		}))
	)

	const filteredEntries = studentCourseEntries.filter(entry => {
		const matchesCourse =
			courseFilter === 'all' || entry.course.id === courseFilter
		const matchesSearch =
			entry.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.student.email.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesCourse && matchesSearch
	})

	// Get unique students from filtered entries
	const filteredStudents = Array.from(
		new Map(
			filteredEntries.map(entry => [entry.student.id, entry.student])
		).values()
	)

	// Calculate statistics
	const totalStudents = students.length
	const totalProgress = studentCourseEntries.reduce(
		(sum, entry) => sum + entry.course.progress,
		0
	)
	const avgProgress =
		studentCourseEntries.length > 0
			? Math.round(totalProgress / studentCourseEntries.length)
			: 0
	const atRiskCount = studentCourseEntries.filter(
		entry => entry.course.progress < 50
	).length

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Students</h1>
				<p className='text-muted-foreground mt-1'>
					Monitor and communicate with your students
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Students
						</p>
						<p className='text-3xl font-bold'>{totalStudents}</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Avg. Progress
						</p>
						<p className='text-3xl font-bold'>{avgProgress}%</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>At Risk</p>
						<p className='text-3xl font-bold'>{atRiskCount}</p>
					</div>
				</Card>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search students...'
								className='pl-9'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select value={courseFilter} onValueChange={setCourseFilter}>
							<SelectTrigger className='w-full sm:w-[200px]'>
								<SelectValue placeholder='Filter by course' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Courses</SelectItem>
								{courses.map(course => (
									<SelectItem key={course.id} value={course.id}>
										{course.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{loading ? (
						<div className='text-center py-12 text-muted-foreground'>
							Loading students...
						</div>
					) : filteredStudents.length === 0 ? (
						<div className='text-center py-12 text-muted-foreground'>
							{searchQuery || courseFilter !== 'all'
								? 'No students found matching your filters'
								: 'No students enrolled yet'}
						</div>
					) : (
						<div className='space-y-3'>
							{filteredStudents.map(student => {
								// Get courses for this student that match the filter
								const studentCourses =
									courseFilter === 'all'
										? student.courses
										: student.courses.filter(c => c.id === courseFilter)

								return (
									<Card
										key={student.id}
										className='p-4 hover:border-primary/50 transition-colors'
									>
										<div className='space-y-4'>
											<div className='flex items-center gap-3'>
												<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
													{student.avatarUrl ? (
														<img
															src={student.avatarUrl}
															alt={student.name}
															className='w-12 h-12 rounded-full object-cover'
														/>
													) : (
														<span className='text-lg font-medium text-primary'>
															{student.name.charAt(0)}
														</span>
													)}
												</div>
												<div className='flex-1 min-w-0'>
													<p className='font-semibold'>{student.name}</p>
													<p className='text-sm text-muted-foreground flex items-center gap-1'>
														<Mail className='w-3 h-3' />
														{student.email}
													</p>
												</div>
												<div className='text-right'>
													<p className='text-xs text-muted-foreground'>
														Last Active
													</p>
													<p className='text-sm font-medium'>
														{student.lastActive}
													</p>
												</div>
											</div>

											<div className='space-y-2'>
												{studentCourses.map(course => (
													<div
														key={course.id}
														className='flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 p-3 bg-muted/30 rounded-lg'
													>
														<div className='min-w-[150px]'>
															<Badge variant='outline'>{course.title}</Badge>
														</div>
														<div className='flex-1'>
															<p className='text-xs text-muted-foreground mb-1'>
																Progress
															</p>
															<div className='flex items-center gap-2'>
																<Progress
																	value={course.progress}
																	className='flex-1'
																/>
																<span className='text-sm font-medium w-10 text-right'>
																	{course.progress}%
																</span>
															</div>
														</div>
														<div className='min-w-[60px]'>
															<p className='text-xs text-muted-foreground mb-1'>
																Grade
															</p>
															<p className='text-sm font-bold'>
																{course.grade}
															</p>
														</div>
													</div>
												))}
											</div>

											<div className='flex gap-2 pt-2 border-t'>
												<Button
													variant='outline'
													size='sm'
													className='gap-2 bg-transparent'
												>
													<Mail className='w-4 h-4' />
													Email
												</Button>
												<Button
													variant='outline'
													size='sm'
													className='gap-2 bg-transparent'
												>
													<MessageSquare className='w-4 h-4' />
													Message
												</Button>
											</div>
										</div>
									</Card>
								)
							})}
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
