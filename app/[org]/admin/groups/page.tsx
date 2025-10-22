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
import { Edit, Plus, Search, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

type Member = {
	id: string
	name: string
	email: string
	avatarUrl: string | null
}

type Group = {
	id: string
	name: string
	description: string | null
	courseId: string | null
	courseName: string | null
	assignedTeacherId: string | null
	assignedTeacher: {
		id: string
		name: string
		email: string
	} | null
	members: Member[]
}

type Course = {
	id: string
	title: string
}

type Teacher = {
	id: string
	name: string
	email: string
}

type Student = {
	id: string
	name: string
	email: string
	avatarUrl: string | null
}

export default function AdminGroupsPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [groups, setGroups] = useState<Group[]>([])
	const [courses, setCourses] = useState<Course[]>([])
	const [teachers, setTeachers] = useState<Teacher[]>([])
	const [students, setStudents] = useState<Student[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [courseFilter, setCourseFilter] = useState('all')
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [editingGroup, setEditingGroup] = useState<Group | null>(null)
	const [newGroup, setNewGroup] = useState({
		name: '',
		description: '',
		courseId: '',
		assignedTeacherId: '',
		memberIds: [] as string[],
	})

	const fetchGroups = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			const response = await fetch(`/api/org/${orgSlug}/admin/groups`)
			if (!response.ok) throw new Error('Failed to fetch groups')
			const data = await response.json()
			setGroups(data.groups)
		} catch (error) {
			console.error('Error fetching groups:', error)
			toast({
				title: 'Error',
				description: 'Failed to load groups',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const fetchCourses = async () => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/courses`)
			if (!response.ok) throw new Error('Failed to fetch courses')
			const data = await response.json()
			setCourses(data.courses)
		} catch (error) {
			console.error('Error fetching courses:', error)
		}
	}

	const fetchTeachers = async () => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/users?role=teacher`)
			if (!response.ok) throw new Error('Failed to fetch teachers')
			const data = await response.json()
			setTeachers(data.users || [])
		} catch (error) {
			console.error('Error fetching teachers:', error)
		}
	}

	const fetchStudents = async () => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/users?role=student`)
			if (!response.ok) throw new Error('Failed to fetch students')
			const data = await response.json()
			setStudents(data.users || [])
		} catch (error) {
			console.error('Error fetching students:', error)
		}
	}

	useEffect(() => {
		fetchGroups()
		fetchCourses()
		fetchTeachers()
		fetchStudents()
	}, [orgSlug])

	const handleCreateGroup = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug || !newGroup.name) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/admin/groups`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newGroup),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to create group')
			}

			toast({
				title: 'Success',
				description: 'Group created successfully',
			})

			setIsCreateOpen(false)
			setNewGroup({
				name: '',
				description: '',
				courseId: '',
				assignedTeacherId: '',
				memberIds: [],
			})
			fetchGroups()
		} catch (error) {
			console.error('Error creating group:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to create group',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdateGroup = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug || !editingGroup) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/admin/groups`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					groupId: editingGroup.id,
					name: editingGroup.name,
					description: editingGroup.description,
					courseId: editingGroup.courseId,
					assignedTeacherId: editingGroup.assignedTeacherId,
					memberIds: editingGroup.members.map(m => m.id),
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to update group')
			}

			toast({
				title: 'Success',
				description: 'Group updated successfully',
			})

			setIsEditOpen(false)
			setEditingGroup(null)
			fetchGroups()
		} catch (error) {
			console.error('Error updating group:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to update group',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteGroup = async (groupId: string) => {
		if (!orgSlug || !confirm('Are you sure you want to delete this group?'))
			return

		try {
			const response = await fetch(
				`/api/org/${orgSlug}/admin/groups?groupId=${groupId}`,
				{ method: 'DELETE' }
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to delete group')
			}

			toast({
				title: 'Success',
				description: 'Group deleted successfully',
			})

			fetchGroups()
		} catch (error) {
			console.error('Error deleting group:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to delete group',
				variant: 'destructive',
			})
		}
	}

	const toggleMemberInNewGroup = (studentId: string) => {
		setNewGroup(prev => ({
			...prev,
			memberIds: prev.memberIds.includes(studentId)
				? prev.memberIds.filter(id => id !== studentId)
				: [...prev.memberIds, studentId],
		}))
	}

	const toggleMemberInEditGroup = (student: Student) => {
		if (!editingGroup) return
		setEditingGroup({
			...editingGroup,
			members: editingGroup.members.some(m => m.id === student.id)
				? editingGroup.members.filter(m => m.id !== student.id)
				: [...editingGroup.members, student],
		})
	}

	const filteredGroups = groups.filter(group => {
		const matchesCourse =
			courseFilter === 'all' || group.courseId === courseFilter
		const matchesSearch = group.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
		return matchesCourse && matchesSearch
	})

	const filteredStudentsForCreate = students.filter(
		s => !newGroup.courseId || s.id // For now show all students
	)

	const filteredStudentsForEdit =
		editingGroup && students.filter(s => !editingGroup.courseId || s.id)

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Manage Groups</h1>
					<p className='text-muted-foreground mt-1'>
						Create and manage student groups
					</p>
				</div>
				<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
					<DialogTrigger asChild>
						<Button className='gap-2'>
							<Plus className='w-4 h-4' />
							Create Group
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
						<form onSubmit={handleCreateGroup}>
							<DialogHeader>
								<DialogTitle>Create New Group</DialogTitle>
								<DialogDescription>
									Create a new student group and assign a teacher
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Group Name *</Label>
									<Input
										id='name'
										placeholder='Enter group name'
										value={newGroup.name}
										onChange={e =>
											setNewGroup({ ...newGroup, name: e.target.value })
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										id='description'
										placeholder='Enter group description'
										value={newGroup.description}
										onChange={e =>
											setNewGroup({ ...newGroup, description: e.target.value })
										}
										rows={3}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='course'>Course</Label>
									<Select
										value={newGroup.courseId}
										onValueChange={value =>
											setNewGroup({ ...newGroup, courseId: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select course (optional)' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='none'>No course</SelectItem>
											{courses.map(course => (
												<SelectItem key={course.id} value={course.id}>
													{course.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='teacher'>Assign Teacher</Label>
									<Select
										value={newGroup.assignedTeacherId}
										onValueChange={value =>
											setNewGroup({ ...newGroup, assignedTeacherId: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select teacher (optional)' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='none'>No teacher</SelectItem>
											{teachers.map(teacher => (
												<SelectItem key={teacher.id} value={teacher.id}>
													{teacher.name} ({teacher.email})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Select Members</Label>
									<div className='border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto'>
										{filteredStudentsForCreate.map(student => (
											<div
												key={student.id}
												className='flex items-center gap-3 p-2 hover:bg-accent rounded-md'
											>
												<Checkbox
													checked={newGroup.memberIds.includes(student.id)}
													onCheckedChange={() =>
														toggleMemberInNewGroup(student.id)
													}
												/>
												<div className='flex-1'>
													<p className='text-sm font-medium'>{student.name}</p>
													<p className='text-xs text-muted-foreground'>
														{student.email}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => setIsCreateOpen(false)}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting ? 'Creating...' : 'Create Group'}
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
							Total Groups
						</p>
						<p className='text-3xl font-bold'>{groups.length}</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Students
						</p>
						<p className='text-3xl font-bold'>
							{groups.reduce((acc, group) => acc + group.members.length, 0)}
						</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Assigned Teachers
						</p>
						<p className='text-3xl font-bold'>
							{
								new Set(groups.map(g => g.assignedTeacherId).filter(Boolean))
									.size
							}
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
								placeholder='Search groups...'
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
							Loading groups...
						</div>
					) : filteredGroups.length === 0 ? (
						<div className='text-center py-12'>
							<div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4'>
								<Users className='w-8 h-8 text-primary' />
							</div>
							<h3 className='text-lg font-semibold mb-2'>No groups found</h3>
							<p className='text-muted-foreground'>
								{searchQuery || courseFilter !== 'all'
									? 'Try adjusting your filters'
									: 'Create your first group to get started'}
							</p>
						</div>
					) : (
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{filteredGroups.map(group => (
								<Card
									key={group.id}
									className='p-4 hover:border-primary/50 transition-colors'
								>
									<div className='space-y-4'>
										<div className='flex items-start justify-between'>
											<div className='flex items-center gap-3 flex-1'>
												<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
													<Users className='w-5 h-5 text-primary' />
												</div>
												<div className='flex-1 min-w-0'>
													<h3 className='font-semibold truncate'>
														{group.name}
													</h3>
													<p className='text-xs text-muted-foreground'>
														{group.members.length} member
														{group.members.length !== 1 ? 's' : ''}
													</p>
												</div>
											</div>
											<div className='flex gap-1'>
												<Button
													variant='ghost'
													size='sm'
													className='h-8 w-8 p-0'
													onClick={() => {
														setEditingGroup(group)
														setIsEditOpen(true)
													}}
												>
													<Edit className='w-4 h-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													className='h-8 w-8 p-0 text-destructive'
													onClick={() => handleDeleteGroup(group.id)}
												>
													<Trash2 className='w-4 h-4' />
												</Button>
											</div>
										</div>
										{group.description && (
											<p className='text-sm text-muted-foreground line-clamp-2'>
												{group.description}
											</p>
										)}
										<div className='space-y-2'>
											{group.courseName && (
												<Badge variant='outline'>{group.courseName}</Badge>
											)}
											{group.assignedTeacher && (
												<div className='flex items-center gap-2 text-xs text-muted-foreground'>
													<span className='font-medium'>Teacher:</span>
													<span>{group.assignedTeacher.name}</span>
												</div>
											)}
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Card>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
					{editingGroup && (
						<form onSubmit={handleUpdateGroup}>
							<DialogHeader>
								<DialogTitle>Edit Group</DialogTitle>
								<DialogDescription>
									Update group details and members
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='edit-name'>Group Name *</Label>
									<Input
										id='edit-name'
										value={editingGroup.name}
										onChange={e =>
											setEditingGroup({ ...editingGroup, name: e.target.value })
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='edit-description'>Description</Label>
									<Textarea
										id='edit-description'
										value={editingGroup.description || ''}
										onChange={e =>
											setEditingGroup({
												...editingGroup,
												description: e.target.value,
											})
										}
										rows={3}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='edit-course'>Course</Label>
									<Select
										value={editingGroup.courseId || 'none'}
										onValueChange={value =>
											setEditingGroup({
												...editingGroup,
												courseId: value === 'none' ? null : value,
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='none'>No course</SelectItem>
											{courses.map(course => (
												<SelectItem key={course.id} value={course.id}>
													{course.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='edit-teacher'>Assign Teacher</Label>
									<Select
										value={editingGroup.assignedTeacherId || 'none'}
										onValueChange={value =>
											setEditingGroup({
												...editingGroup,
												assignedTeacherId: value === 'none' ? null : value,
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='none'>No teacher</SelectItem>
											{teachers.map(teacher => (
												<SelectItem key={teacher.id} value={teacher.id}>
													{teacher.name} ({teacher.email})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Select Members</Label>
									<div className='border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto'>
										{filteredStudentsForEdit &&
											filteredStudentsForEdit.map(student => (
												<div
													key={student.id}
													className='flex items-center gap-3 p-2 hover:bg-accent rounded-md'
												>
													<Checkbox
														checked={editingGroup.members.some(
															m => m.id === student.id
														)}
														onCheckedChange={() =>
															toggleMemberInEditGroup(student)
														}
													/>
													<div className='flex-1'>
														<p className='text-sm font-medium'>
															{student.name}
														</p>
														<p className='text-xs text-muted-foreground'>
															{student.email}
														</p>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => {
										setIsEditOpen(false)
										setEditingGroup(null)
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
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
