'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
	Archive,
	Edit,
	MoreVertical,
	Plus,
	Search,
	Trash2,
	UserPlus,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type Teacher = {
	id: string
	name: string
	email: string
}

type Course = {
	id: string
	title: string
	description: string | null
	thumbnailUrl: string | null
	status: string
	createdBy: {
		id: string
		name: string
		email: string
	}
	instructors: Teacher[]
	enrollmentCount: number
	createdAt: string
}

export default function AdminCoursesPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [courses, setCourses] = useState<Course[]>([])
	const [teachers, setTeachers] = useState<Teacher[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Form state
	const [newCourse, setNewCourse] = useState({
		title: '',
		description: '',
		thumbnailUrl: '',
		status: 'draft',
		instructorIds: [] as string[],
	})

	const [editingCourse, setEditingCourse] = useState<Course | null>(null)
	const [editFormData, setEditFormData] = useState({
		title: '',
		description: '',
		thumbnailUrl: '',
		status: 'draft',
	})

	const [assigningCourse, setAssigningCourse] = useState<Course | null>(null)
	const [selectedInstructors, setSelectedInstructors] = useState<string[]>([])

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
			setTeachers(
				data.teachers.map((t: any) => ({
					id: t.id,
					name: t.name,
					email: t.email,
				}))
			)
		} catch (error) {
			console.error('Error fetching teachers:', error)
		}
	}

	useEffect(() => {
		fetchCourses()
		fetchTeachers()
	}, [orgSlug])

	const handleCreateCourse = async (e: React.FormEvent) => {
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

			setIsCreateDialogOpen(false)
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
		})
		setIsEditDialogOpen(true)
	}

	const handleUpdateCourse = async (e: React.FormEvent) => {
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

	const handleAssignTeachers = (course: Course) => {
		setAssigningCourse(course)
		setSelectedInstructors(course.instructors.map(i => i.id))
		setIsAssignDialogOpen(true)
	}

	const handleSaveInstructors = async () => {
		if (!orgSlug || !assigningCourse) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/courses`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					courseId: assigningCourse.id,
					instructorIds: selectedInstructors,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to assign teachers')
			}

			toast({
				title: 'Success',
				description: 'Teachers assigned successfully',
			})

			setIsAssignDialogOpen(false)
			setAssigningCourse(null)
			setSelectedInstructors([])
			fetchCourses()
		} catch (error) {
			console.error('Error assigning teachers:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to assign teachers',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteCourse = async (courseId: string) => {
		if (!orgSlug) return
		if (!confirm('Are you sure you want to delete this course?')) return

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

	const toggleInstructor = (teacherId: string, isNewCourse: boolean) => {
		if (isNewCourse) {
			setNewCourse({
				...newCourse,
				instructorIds: newCourse.instructorIds.includes(teacherId)
					? newCourse.instructorIds.filter(id => id !== teacherId)
					: [...newCourse.instructorIds, teacherId],
			})
		} else {
			setSelectedInstructors(
				selectedInstructors.includes(teacherId)
					? selectedInstructors.filter(id => id !== teacherId)
					: [...selectedInstructors, teacherId]
			)
		}
	}

	const filteredCourses = courses.filter(course => {
		const matchesStatus =
			statusFilter === 'all' || course.status === statusFilter
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description?.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesStatus && matchesSearch
	})

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
					<h1 className='text-3xl font-bold tracking-tight'>Courses</h1>
					<p className='text-muted-foreground mt-1'>
						Manage courses and assign teachers
					</p>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button className='gap-2'>
							<Plus className='w-4 h-4' />
							Create Course
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
						<form onSubmit={handleCreateCourse}>
							<DialogHeader>
								<DialogTitle>Create New Course</DialogTitle>
								<DialogDescription>
									Create a new course and assign teachers
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
										placeholder='Describe your course'
										rows={4}
										value={newCourse.description}
										onChange={e =>
											setNewCourse({
												...newCourse,
												description: e.target.value,
											})
										}
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
										onValueChange={value =>
											setNewCourse({ ...newCourse, status: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='draft'>Draft</SelectItem>
											<SelectItem value='active'>Active</SelectItem>
											<SelectItem value='archived'>Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Assign Teachers</Label>
									<div className='border rounded-lg p-4 space-y-2 max-h-[200px] overflow-y-auto'>
										{teachers.length === 0 ? (
											<p className='text-sm text-muted-foreground text-center py-4'>
												No teachers available
											</p>
										) : (
											teachers.map(teacher => (
												<div
													key={teacher.id}
													className='flex items-center gap-3 p-2 hover:bg-accent rounded-md'
												>
													<Checkbox
														checked={newCourse.instructorIds.includes(
															teacher.id
														)}
														onCheckedChange={() =>
															toggleInstructor(teacher.id, true)
														}
													/>
													<div className='flex-1'>
														<p className='text-sm font-medium'>
															{teacher.name}
														</p>
														<p className='text-xs text-muted-foreground'>
															{teacher.email}
														</p>
													</div>
												</div>
											))
										)}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => setIsCreateDialogOpen(false)}
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

			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Courses
						</p>
						<p className='text-3xl font-bold'>{courses.length}</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Active Courses
						</p>
						<p className='text-3xl font-bold'>
							{courses.filter(c => c.status === 'active').length}
						</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Enrollments
						</p>
						<p className='text-3xl font-bold'>
							{courses.reduce((sum, c) => sum + c.enrollmentCount, 0)}
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
								placeholder='Search courses...'
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
								<SelectItem value='draft'>Draft</SelectItem>
								<SelectItem value='active'>Active</SelectItem>
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
						<div className='space-y-4'>
							{filteredCourses.map(course => (
								<Card
									key={course.id}
									className='p-4 hover:border-primary/50 transition-colors'
								>
									<div className='flex flex-col lg:flex-row lg:items-center gap-4'>
										<div className='flex-1 space-y-3'>
											<div className='flex items-start justify-between gap-4'>
												<div>
													<h3 className='font-semibold text-lg'>
														{course.title}
													</h3>
													<p className='text-sm text-muted-foreground mt-1'>
														{course.description || 'No description provided'}
													</p>
													<div className='flex items-center gap-2 mt-2'>
														<span className='text-xs text-muted-foreground'>
															Created by {course.createdBy.name}
														</span>
													</div>
												</div>
												<Badge className={getStatusColor(course.status)}>
													{course.status.charAt(0).toUpperCase() +
														course.status.slice(1)}
												</Badge>
											</div>
											<div className='flex flex-wrap items-center gap-4 text-sm'>
												<div className='flex items-center gap-2'>
													<Users className='w-4 h-4 text-muted-foreground' />
													<span className='font-medium'>
														{course.enrollmentCount}
													</span>
													<span className='text-muted-foreground'>
														students
													</span>
												</div>
												<div className='flex items-center gap-2'>
													<span className='text-muted-foreground'>
														Teachers:
													</span>
													<span className='font-medium'>
														{course.instructors.length}
													</span>
												</div>
												{course.instructors.length > 0 && (
													<div className='flex items-center gap-1'>
														{course.instructors.slice(0, 3).map(instructor => (
															<div
																key={instructor.id}
																className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary'
																title={instructor.name}
															>
																{instructor.name.charAt(0)}
															</div>
														))}
														{course.instructors.length > 3 && (
															<div className='w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium'>
																+{course.instructors.length - 3}
															</div>
														)}
													</div>
												)}
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Button
												size='sm'
												variant='outline'
												className='gap-2 bg-transparent'
												onClick={() => handleAssignTeachers(course)}
											>
												<UserPlus className='w-4 h-4' />
												Assign Teachers
											</Button>
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
													{course.status === 'active' && (
														<DropdownMenuItem
															onClick={() => {
																// Archive course logic
															}}
														>
															<Archive className='w-4 h-4 mr-2' />
															Archive Course
														</DropdownMenuItem>
													)}
													<DropdownMenuItem
														onClick={() => handleDeleteCourse(course.id)}
														className='text-destructive'
													>
														<Trash2 className='w-4 h-4 mr-2' />
														Delete Course
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Card>

			{/* Edit Course Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='max-w-2xl'>
					<form onSubmit={handleUpdateCourse}>
						<DialogHeader>
							<DialogTitle>Edit Course</DialogTitle>
							<DialogDescription>Update course information</DialogDescription>
						</DialogHeader>
						{editingCourse && (
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='edit-title'>Course Title</Label>
									<Input
										id='edit-title'
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
										onValueChange={value =>
											setEditFormData({ ...editFormData, status: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='draft'>Draft</SelectItem>
											<SelectItem value='active'>Active</SelectItem>
											<SelectItem value='archived'>Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsEditDialogOpen(false)}
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

			{/* Assign Teachers Dialog */}
			<Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
				<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Assign Teachers</DialogTitle>
						<DialogDescription>
							{assigningCourse?.title
								? `Assign teachers to "${assigningCourse.title}"`
								: 'Select teachers to assign to this course'}
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						<div className='border rounded-lg p-4 space-y-2 max-h-[400px] overflow-y-auto'>
							{teachers.length === 0 ? (
								<p className='text-sm text-muted-foreground text-center py-4'>
									No teachers available
								</p>
							) : (
								teachers.map(teacher => (
									<div
										key={teacher.id}
										className='flex items-center gap-3 p-2 hover:bg-accent rounded-md'
									>
										<Checkbox
											checked={selectedInstructors.includes(teacher.id)}
											onCheckedChange={() =>
												toggleInstructor(teacher.id, false)
											}
										/>
										<div className='flex-1'>
											<p className='text-sm font-medium'>{teacher.name}</p>
											<p className='text-xs text-muted-foreground'>
												{teacher.email}
											</p>
										</div>
									</div>
								))
							)}
						</div>
						<p className='text-sm text-muted-foreground'>
							Selected: {selectedInstructors.length} teacher
							{selectedInstructors.length !== 1 ? 's' : ''}
						</p>
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								setIsAssignDialogOpen(false)
								setSelectedInstructors([])
							}}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveInstructors} disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save Assignments'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
