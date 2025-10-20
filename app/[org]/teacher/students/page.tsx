'use client'

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
import { Mail, MessageSquare, Search } from 'lucide-react'
import { useState } from 'react'

const students = [
	{
		id: 1,
		name: 'Alice Johnson',
		email: 'alice@example.com',
		course: 'ML Advanced',
		progress: 78,
		grade: 'A-',
		lastActive: '2 hours ago',
	},
	{
		id: 2,
		name: 'Bob Smith',
		email: 'bob@example.com',
		course: 'Web Dev',
		progress: 65,
		grade: 'B',
		lastActive: '5 hours ago',
	},
	{
		id: 3,
		name: 'Carol White',
		email: 'carol@example.com',
		course: 'Data Science',
		progress: 92,
		grade: 'A+',
		lastActive: '1 hour ago',
	},
	{
		id: 4,
		name: 'David Brown',
		email: 'david@example.com',
		course: 'ML Advanced',
		progress: 45,
		grade: 'C',
		lastActive: '1 day ago',
	},
	{
		id: 5,
		name: 'Emma Davis',
		email: 'emma@example.com',
		course: 'Web Dev',
		progress: 88,
		grade: 'A',
		lastActive: '3 hours ago',
	},
	{
		id: 6,
		name: 'Frank Miller',
		email: 'frank@example.com',
		course: 'Data Science',
		progress: 72,
		grade: 'B+',
		lastActive: '6 hours ago',
	},
]

export default function StudentsPage() {
	const [courseFilter, setCourseFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	const filteredStudents = students.filter(student => {
		const matchesCourse =
			courseFilter === 'all' || student.course === courseFilter
		const matchesSearch =
			student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			student.email.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesCourse && matchesSearch
	})

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
						<p className='text-3xl font-bold'>{students.length}</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Avg. Progress
						</p>
						<p className='text-3xl font-bold'>
							{Math.round(
								students.reduce((acc, s) => acc + s.progress, 0) /
									students.length
							)}
							%
						</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>At Risk</p>
						<p className='text-3xl font-bold'>
							{students.filter(s => s.progress < 50).length}
						</p>
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
								<SelectItem value='ML Advanced'>ML Advanced</SelectItem>
								<SelectItem value='Web Dev'>Web Dev</SelectItem>
								<SelectItem value='Data Science'>Data Science</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-3'>
						{filteredStudents.map(student => (
							<Card
								key={student.id}
								className='p-4 hover:border-primary/50 transition-colors'
							>
								<div className='flex flex-col lg:flex-row lg:items-center gap-4'>
									<div className='flex items-center gap-3 flex-1'>
										<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
											<span className='text-lg font-medium text-primary'>
												{student.name.charAt(0)}
											</span>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='font-semibold'>{student.name}</p>
											<p className='text-sm text-muted-foreground flex items-center gap-1'>
												<Mail className='w-3 h-3' />
												{student.email}
											</p>
										</div>
									</div>

									<div className='flex flex-wrap items-center gap-4 lg:gap-6'>
										<div className='min-w-[120px]'>
											<p className='text-xs text-muted-foreground mb-1'>
												Course
											</p>
											<p className='text-sm font-medium'>{student.course}</p>
										</div>
										<div className='min-w-[150px]'>
											<p className='text-xs text-muted-foreground mb-1'>
												Progress
											</p>
											<div className='flex items-center gap-2'>
												<Progress value={student.progress} className='flex-1' />
												<span className='text-sm font-medium w-10 text-right'>
													{student.progress}%
												</span>
											</div>
										</div>
										<div className='min-w-[60px]'>
											<p className='text-xs text-muted-foreground mb-1'>
												Grade
											</p>
											<p className='text-sm font-bold'>{student.grade}</p>
										</div>
										<div className='flex gap-2'>
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
								</div>
							</Card>
						))}
					</div>
				</div>
			</Card>
		</div>
	)
}
