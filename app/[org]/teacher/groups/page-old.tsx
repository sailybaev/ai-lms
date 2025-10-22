'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
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

type Student = {
	id: string
	name: string
	email: string
	avatarUrl: string | null
}

type Course = {
	id: string
	title: string
}

type Group = {
	id: string
	name: string
	description: string | null
	courseId: string | null
	courseName: string | null
	members: Student[]
}

export default function GroupsPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [groups, setGroups] = useState<Group[]>([])
	const [courses, setCourses] = useState<Course[]>([])
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
		memberIds: [] as string[],
	})

	const fetchGroups = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			const response = await fetch(`/api/org/${orgSlug}/teacher/groups`)
			if (!response.ok) {
				throw new Error('Failed to fetch groups')
			}
			const data = await response.json()
			setGroups(data.groups)
		} catch (error) {
			console.error('Error fetching groups:', error)
			toast({
				title: 'Error',
				description: 'Failed to load groups. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const fetchCourses = async () => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/teacher/courses`)
			if (!response.ok) {
				throw new Error('Failed to fetch courses')
			}
			const data = await response.json()
			setCourses(data.courses)
		} catch (error) {
			console.error('Error fetching courses:', error)
		}
	}

	const fetchStudents = async () => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/students`)
			if (!response.ok) {
				throw new Error('Failed to fetch students')
			}
			const data = await response.json()
			setStudents(
				data.students.map((s: any) => ({
					id: s.id,
					name: s.name,
					email: s.email,
					avatarUrl: s.avatarUrl,
				}))
			)
		} catch (error) {
			console.error('Error fetching students:', error)
		}
	}

	useEffect(() => {
		fetchGroups()
		fetchCourses()
		fetchStudents()
	}, [orgSlug])

	const handleCreateGroup = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/teacher/groups`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...newGroup,
					courseId: newGroup.courseId || null,
				}),
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
			setNewGroup({ name: '', description: '', courseId: '', memberIds: [] })
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

	const handleEditGroup = (group: Group) => {
		setEditingGroup(group)
		setIsEditOpen(true)
	}

	const handleUpdateGroup = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug || !editingGroup) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/teacher/groups`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					groupId: editingGroup.id,
					name: editingGroup.name,
					description: editingGroup.description,
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
		if (!orgSlug) return
		if (!confirm('Are you sure you want to delete this group?')) return

		try {
			const response = await fetch(
				`/api/org/${orgSlug}/teacher/groups?groupId=${groupId}`,
				{
					method: 'DELETE',
				}
			)

			if (!response.ok) {
				throw new Error('Failed to delete group')
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
				description: 'Failed to delete group',
				variant: 'destructive',
			})
		}
	}

	const toggleMember = (studentId: string, isEditing: boolean) => {
		if (isEditing && editingGroup) {
			const memberIds = editingGroup.members.map(m => m.id)
			const student = students.find(s => s.id === studentId)
			if (!student) return

			const newMembers = memberIds.includes(studentId)
				? editingGroup.members.filter(m => m.id !== studentId)
				: [...editingGroup.members, student]

			setEditingGroup({ ...editingGroup, members: newMembers })
		} else {
			const memberIds = newGroup.memberIds.includes(studentId)
				? newGroup.memberIds.filter(id => id !== studentId)
				: [...newGroup.memberIds, studentId]
			setNewGroup({ ...newGroup, memberIds })
		}
	}

	const filteredGroups = groups.filter(group => {
		const matchesCourse =
			courseFilter === 'all' || group.courseId === courseFilter
		const matchesSearch = group.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
		return matchesCourse && matchesSearch
	})

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Student Groups</h1>
					<p className='text-muted-foreground mt-1'>
						Organize students into collaborative groups for courses
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
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='course'>Course (Optional)</Label>
									<Select
										value={newGroup.courseId}
										onValueChange={value =>
											setNewGroup({ ...newGroup, courseId: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select course or leave empty' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='none'>No Course</SelectItem>
											{courses.map(course => (
												<SelectItem key={course.id} value={course.id}>
													{course.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Select Members</Label>
									<div className='border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto'>
										{students.length === 0 ? (
											<p className='text-sm text-muted-foreground text-center py-4'>
												No students available
											</p>
										) : (
											students.map(student => (
												<div
													key={student.id}
													className='flex items-center gap-3 p-2 hover:bg-accent rounded-md'
												>
													<Checkbox
														checked={newGroup.memberIds.includes(student.id)}
														onCheckedChange={() =>
															toggleMember(student.id, false)
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
											))
										)}
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
							Total Members
						</p>
						<p className='text-3xl font-bold'>
							{groups.reduce((acc, g) => acc + g.members.length, 0)}
						</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Avg. Group Size
						</p>
						<p className='text-3xl font-bold'>
							{groups.length > 0
								? Math.round(
										groups.reduce((acc, g) => acc + g.members.length, 0) /
											groups.length
								  )
								: 0}
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
						<div className='text-center py-12 text-muted-foreground'>
							{searchQuery || courseFilter !== 'all'
								? 'No groups found matching your filters'
								: 'No groups yet. Create your first group to get started.'}
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
											<div className='flex items-center gap-3'>
												<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
													<Users className='w-5 h-5 text-primary' />
												</div>
												<div>
													<h3 className='font-semibold'>{group.name}</h3>
													{group.courseName && (
														<Badge variant='outline' className='mt-1'>
															{group.courseName}
														</Badge>
													)}
												</div>
											</div>
										</div>

										<p className='text-sm text-muted-foreground line-clamp-2'>
											{group.description || 'No description'}
										</p>

										<div className='space-y-2'>
											<div className='flex items-center justify-between text-sm'>
												<span className='text-muted-foreground'>Members</span>
												<span className='font-medium'>
													{group.members.length} students
												</span>
											</div>
											<div className='flex flex-wrap gap-1'>
												{group.members.slice(0, 3).map(student => (
													<div
														key={student.id}
														className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary'
														title={student.name}
													>
														{student.name.charAt(0)}
													</div>
												))}
												{group.members.length > 3 && (
													<div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium'>
														+{group.members.length - 3}
													</div>
												)}
											</div>
										</div>

										<div className='flex gap-2 pt-2 border-t'>
											<Button
												variant='outline'
												size='sm'
												className='flex-1 gap-2 bg-transparent'
												onClick={() => handleEditGroup(group)}
											>
												<Edit className='w-4 h-4' />
												Edit
											</Button>
											<Button
												variant='outline'
												size='sm'
												className='gap-2 bg-transparent text-destructive hover:text-destructive'
												onClick={() => handleDeleteGroup(group.id)}
											>
												<Trash2 className='w-4 h-4' />
												Delete
											</Button>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Card>

			{/* Edit Group Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
					<form onSubmit={handleUpdateGroup}>
						<DialogHeader>
							<DialogTitle>Edit Group</DialogTitle>
						</DialogHeader>
						{editingGroup && (
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='edit-name'>Group Name</Label>
									<Input
										id='edit-name'
										value={editingGroup.name}
										onChange={e =>
											setEditingGroup({
												...editingGroup,
												name: e.target.value,
											})
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
									/>
								</div>
								<div className='space-y-2'>
									<Label>Select Members</Label>
									<div className='border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto'>
										{students.length === 0 ? (
											<p className='text-sm text-muted-foreground text-center py-4'>
												No students available
											</p>
										) : (
											students.map(student => (
												<div
													key={student.id}
													className='flex items-center gap-3 p-2 hover:bg-accent rounded-md'
												>
													<Checkbox
														checked={editingGroup.members.some(
															m => m.id === student.id
														)}
														onCheckedChange={() =>
															toggleMember(student.id, true)
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
				</DialogContent>
			</Dialog>
		</div>
	)
}
