'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import {
	BookOpen,
	Edit,
	MoreVertical,
	Plus,
	Search,
	Trash2,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type Course = {
	id: string
	title: string
	description: string | null
	thumbnailUrl: string | null
	status: 'draft' | 'active' | 'archived'
	createdBy: {
		id: string
		name: string
		email: string
	}
	instructors: {
		id: string
		name: string
		email: string
	}[]
	enrollmentCount: number
	createdAt: string
}

type Teacher = {
	id: string
	name: string
	email: string
}

export default function OrgAdminCoursesPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [courses, setCourses] = useState<Course[]>([])
	const [teachers, setTeachers] = useState<Teacher[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Form state
	const [newCourse, setNewCourse] = useState({
		title: '',
		description: '',
		thumbnailUrl: '',
		status: 'draft' as 'draft' | 'active' | 'archived',
		instructorIds: [] as string[],
	})

	const [editingCourse, setEditingCourse] = useState<Course | null>(null)
	const [editFormData, setEditFormData] = useState({
		title: '',
		description: '',
		thumbnailUrl: '',
		status: 'draft' as 'draft' | 'active' | 'archived',
		instructorIds: [] as string[],
	})

	const fetchCourses = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			const response = await fetch(`/api/org/${orgSlug}/courses`)
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

	const fetchTeachers = async () => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/teachers`)
			if (!response.ok) {
				throw new Error('Failed to fetch teachers')
			}
			const data = await response.json()
			setTeachers(data.teachers)
		} catch (error) {
			console.error('Error fetching teachers:', error)
		}
	}

	useEffect(() => {
		fetchCourses()
		fetchTeachers()
	}, [orgSlug])

	const handleAddCourse = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/courses`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newCourse),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to create course')
			}

			toast({
				title: 'Success',
				description: 'Course created successfully',
			})

			setIsAddDialogOpen(false)
			setNewCourse({
				title: '',
				description: '',
				thumbnailUrl: '',
				status: 'draft',
				instructorIds: [],
			})
			fetchCourses()
		} catch (error) {
			console.error('Error creating course:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to create course',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleEditCourse = (course: Course) => {
		setEditingCourse(course)
		setEditFormData({
			title: course.title,
			description: course.description || '',
			thumbnailUrl: course.thumbnailUrl || '',
			status: course.status,
			instructorIds: course.instructors.map(i => i.id),
		})
		setIsEditDialogOpen(true)
	}

	const handleSaveCourse = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug || !editingCourse) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/courses`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					courseId: editingCourse.id,
					...editFormData,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to update course')
			}

			toast({
				title: 'Success',
				description: 'Course updated successfully',
			})

			setIsEditDialogOpen(false)
			setEditingCourse(null)
			setEditFormData({
				title: '',
				description: '',
				thumbnailUrl: '',
				status: 'draft',
				instructorIds: [],
			})
			fetchCourses()
		} catch (error) {
			console.error('Error updating course:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to update course',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteCourse = async (courseId: string) => {
		if (!orgSlug) return
		if (
			!confirm(
				'Are you sure you want to delete this course? This action cannot be undone.'
			)
		) {
			return
		}

		try {
			const response = await fetch(
				`/api/org/${orgSlug}/courses?courseId=${courseId}`,
				{
					method: 'DELETE',
				}
			)

			if (!response.ok) {
				throw new Error('Failed to delete course')
			}

			toast({
				title: 'Success',
				description: 'Course deleted successfully',
			})

			fetchCourses()
		} catch (error) {
			console.error('Error deleting course:', error)
			toast({
				title: 'Error',
				description: 'Failed to delete course',
				variant: 'destructive',
			})
		}
	}

	const filteredCourses = courses.filter(course => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.instructors.some(i =>
				i.name.toLowerCase().includes(searchQuery.toLowerCase())
			)
		const matchesStatus =
			statusFilter === 'all' || course.status === statusFilter
		return matchesSearch && matchesStatus
	})

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return (
					<Badge className='bg-green-500/10 text-green-500 hover:bg-green-500/20'>
						Active
					</Badge>
				)
			case 'draft':
				return (
					<Badge className='bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'>
						Draft
					</Badge>
				)
			case 'archived':
				return (
					<Badge className='bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'>
						Archived
					</Badge>
				)
			default:
				return <Badge variant='secondary'>{status}</Badge>
		}
	}

	const toggleInstructor = (
		instructorId: string,
		currentIds: string[],
		setter: (ids: string[]) => void
	) => {
		if (currentIds.includes(instructorId)) {
			setter(currentIds.filter(id => id !== instructorId))
		} else {
			setter([...currentIds, instructorId])
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Courses</h1>
					<p className='text-muted-foreground mt-1'>
						Manage courses in your organization
					</p>
				</div>
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className='w-4 h-4 mr-2' />
							Add Course
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<form onSubmit={handleAddCourse}>
							<DialogHeader>
								<DialogTitle>Create New Course</DialogTitle>
								<DialogDescription>
									Add a new course to your organization
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='title'>Course Title *</Label>
									<Input
										id='title'
										placeholder='Enter course title'
										value={newCourse.title}
										onChange={e =>
											setNewCourse({ ...newCourse, title: e.target.value })
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										id='description'
										placeholder='Enter course description'
										value={newCourse.description}
										onChange={e =>
											setNewCourse({
												...newCourse,
												description: e.target.value,
											})
										}
										rows={4}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='thumbnailUrl'>Thumbnail URL</Label>
									<Input
										id='thumbnailUrl'
										type='url'
										placeholder='https://example.com/image.jpg'
										value={newCourse.thumbnailUrl}
										onChange={e =>
											setNewCourse({
												...newCourse,
												thumbnailUrl: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='status'>Status</Label>
									<Select
										value={newCourse.status}
										onValueChange={(value: 'draft' | 'active' | 'archived') =>
											setNewCourse({ ...newCourse, status: value })
										}
									>
										<SelectTrigger id='status'>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='draft'>Draft</SelectItem>
											<SelectItem value='active'>Active</SelectItem>
											<SelectItem value='archived'>Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Instructors</Label>
									<div className='border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto'>
										{teachers.length === 0 ? (
											<p className='text-sm text-muted-foreground'>
												No teachers available
											</p>
										) : (
											teachers.map(teacher => (
												<label
													key={teacher.id}
													className='flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded'
												>
													<input
														type='checkbox'
														checked={newCourse.instructorIds.includes(
															teacher.id
														)}
														onChange={() =>
															toggleInstructor(
																teacher.id,
																newCourse.instructorIds,
																ids =>
																	setNewCourse({
																		...newCourse,
																		instructorIds: ids,
																	})
															)
														}
														className='rounded'
													/>
													<div className='flex-1'>
														<div className='text-sm font-medium'>
															{teacher.name}
														</div>
														<div className='text-xs text-muted-foreground'>
															{teacher.email}
														</div>
													</div>
												</label>
											))
										)}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => setIsAddDialogOpen(false)}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting ? 'Creating...' : 'Create Course'}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Statistics */}
			<div className='grid gap-4 md:grid-cols-4'>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<BookOpen className='w-5 h-5 text-primary' />
						</div>
						<div>
							<p className='text-2xl font-bold'>{courses.length}</p>
							<p className='text-sm text-muted-foreground'>Total Courses</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-green-500/10 rounded-lg'>
							<BookOpen className='w-5 h-5 text-green-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>
								{courses.filter(c => c.status === 'active').length}
							</p>
							<p className='text-sm text-muted-foreground'>Active</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-yellow-500/10 rounded-lg'>
							<BookOpen className='w-5 h-5 text-yellow-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>
								{courses.filter(c => c.status === 'draft').length}
							</p>
							<p className='text-sm text-muted-foreground'>Draft</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-blue-500/10 rounded-lg'>
							<Users className='w-5 h-5 text-blue-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>
								{courses.reduce((sum, c) => sum + c.enrollmentCount, 0)}
							</p>
							<p className='text-sm text-muted-foreground'>Total Enrollments</p>
						</div>
					</div>
				</Card>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search courses by title, description, or instructor...'
								className='pl-9'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-full sm:w-[180px]'>
								<SelectValue placeholder='Filter by status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Status</SelectItem>
								<SelectItem value='active'>Active</SelectItem>
								<SelectItem value='draft'>Draft</SelectItem>
								<SelectItem value='archived'>Archived</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{loading ? (
						<div className='text-center py-12 text-muted-foreground'>
							Loading courses...
						</div>
					) : filteredCourses.length === 0 ? (
						<div className='text-center py-12 text-muted-foreground'>
							{searchQuery || statusFilter !== 'all'
								? 'No courses found matching your filters'
								: 'No courses yet. Create your first course to get started.'}
						</div>
					) : (
						<div className='border border-border rounded-lg overflow-hidden'>
							<table className='w-full'>
								<thead className='bg-muted/50'>
									<tr>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Course
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Instructors
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Status
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Enrollments
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Created
										</th>
										<th className='text-right p-3 text-sm font-medium text-muted-foreground'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredCourses.map(course => (
										<tr
											key={course.id}
											className='border-t border-border hover:bg-muted/30 transition-colors'
										>
											<td className='p-3'>
												<div className='flex items-center gap-3'>
													{course.thumbnailUrl ? (
														<img
															src={course.thumbnailUrl}
															alt={course.title}
															className='w-12 h-12 rounded object-cover'
														/>
													) : (
														<div className='w-12 h-12 rounded bg-primary/10 flex items-center justify-center'>
															<BookOpen className='w-6 h-6 text-primary' />
														</div>
													)}
													<div>
														<p className='font-medium'>{course.title}</p>
														{course.description && (
															<p className='text-sm text-muted-foreground line-clamp-1'>
																{course.description}
															</p>
														)}
													</div>
												</div>
											</td>
											<td className='p-3'>
												{course.instructors.length > 0 ? (
													<div className='flex flex-col gap-1'>
														{course.instructors.slice(0, 2).map(instructor => (
															<span
																key={instructor.id}
																className='text-sm text-muted-foreground'
															>
																{instructor.name}
															</span>
														))}
														{course.instructors.length > 2 && (
															<span className='text-xs text-muted-foreground'>
																+{course.instructors.length - 2} more
															</span>
														)}
													</div>
												) : (
													<span className='text-sm text-muted-foreground'>
														No instructors
													</span>
												)}
											</td>
											<td className='p-3'>{getStatusBadge(course.status)}</td>
											<td className='p-3'>
												<div className='flex items-center gap-1 text-sm text-muted-foreground'>
													<Users className='w-4 h-4' />
													{course.enrollmentCount}
												</div>
											</td>
											<td className='p-3 text-sm text-muted-foreground'>
												{formatDate(course.createdAt)}
											</td>
											<td className='p-3 text-right'>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon'>
															<MoreVertical className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem
															onClick={() => handleEditCourse(course)}
														>
															<Edit className='w-4 h-4 mr-2' />
															Edit Course
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteCourse(course.id)}
															className='text-destructive'
														>
															<Trash2 className='w-4 h-4 mr-2' />
															Delete Course
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</Card>

			{/* Edit Course Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='max-w-2xl'>
					<form onSubmit={handleSaveCourse}>
						<DialogHeader>
							<DialogTitle>Edit Course</DialogTitle>
							<DialogDescription>
								Update course information and settings
							</DialogDescription>
						</DialogHeader>
						{editingCourse && (
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='edit-title'>Course Title *</Label>
									<Input
										id='edit-title'
										placeholder='Enter course title'
										value={editFormData.title}
										onChange={e =>
											setEditFormData({
												...editFormData,
												title: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='edit-description'>Description</Label>
									<Textarea
										id='edit-description'
										placeholder='Enter course description'
										value={editFormData.description}
										onChange={e =>
											setEditFormData({
												...editFormData,
												description: e.target.value,
											})
										}
										rows={4}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='edit-thumbnailUrl'>Thumbnail URL</Label>
									<Input
										id='edit-thumbnailUrl'
										type='url'
										placeholder='https://example.com/image.jpg'
										value={editFormData.thumbnailUrl}
										onChange={e =>
											setEditFormData({
												...editFormData,
												thumbnailUrl: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='edit-status'>Status</Label>
									<Select
										value={editFormData.status}
										onValueChange={(value: 'draft' | 'active' | 'archived') =>
											setEditFormData({ ...editFormData, status: value })
										}
									>
										<SelectTrigger id='edit-status'>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='draft'>Draft</SelectItem>
											<SelectItem value='active'>Active</SelectItem>
											<SelectItem value='archived'>Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Instructors</Label>
									<div className='border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto'>
										{teachers.length === 0 ? (
											<p className='text-sm text-muted-foreground'>
												No teachers available
											</p>
										) : (
											teachers.map(teacher => (
												<label
													key={teacher.id}
													className='flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded'
												>
													<input
														type='checkbox'
														checked={editFormData.instructorIds.includes(
															teacher.id
														)}
														onChange={() =>
															toggleInstructor(
																teacher.id,
																editFormData.instructorIds,
																ids =>
																	setEditFormData({
																		...editFormData,
																		instructorIds: ids,
																	})
															)
														}
														className='rounded'
													/>
													<div className='flex-1'>
														<div className='text-sm font-medium'>
															{teacher.name}
														</div>
														<div className='text-xs text-muted-foreground'>
															{teacher.email}
														</div>
													</div>
												</label>
											))
										)}
									</div>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => {
									setIsEditDialogOpen(false)
									setEditingCourse(null)
								}}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
