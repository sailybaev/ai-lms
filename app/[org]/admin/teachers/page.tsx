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
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import {
	Ban,
	Camera,
	CheckCircle,
	Edit,
	Mail,
	MoreVertical,
	Search,
	Trash2,
	UserPlus,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Teacher = {
	id: string
	name: string
	email: string
	avatarUrl?: string
	status: string
	membershipId: string
	joinedAt: string
	lastActiveAt?: string
}

export default function OrgTeachersPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [teachers, setTeachers] = useState<Teacher[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [uploadingPhoto, setUploadingPhoto] = useState(false)

	// Form state
	const [newTeacher, setNewTeacher] = useState({
		name: '',
		email: '',
		password: '',
	})

	const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
	const [editFormData, setEditFormData] = useState({
		newPassword: '',
		avatarUrl: '',
	})
	const fileInputRef = useRef<HTMLInputElement>(null)

	const fetchTeachers = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			console.log('Fetching teachers for org:', orgSlug)
			const response = await fetch(`/api/org/${orgSlug}/teachers`)
			console.log('Teachers API response status:', response.status)
			if (!response.ok) {
				throw new Error('Failed to fetch teachers')
			}
			const data = await response.json()
			console.log('Teachers data received:', data)
			setTeachers(data.teachers)
		} catch (error) {
			console.error('Error fetching teachers:', error)
			toast({
				title: 'Error',
				description: 'Failed to load teachers. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchTeachers()
	}, [orgSlug])

	const handleAddTeacher = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/teachers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newTeacher),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to add teacher')
			}

			toast({
				title: 'Success',
				description: 'Teacher added successfully',
			})

			setIsAddDialogOpen(false)
			setNewTeacher({ name: '', email: '', password: '' })
			fetchTeachers()
		} catch (error) {
			console.error('Error adding teacher:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to add teacher',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdateStatus = async (membershipId: string, status: string) => {
		if (!orgSlug) return

		try {
			const response = await fetch(`/api/org/${orgSlug}/teachers`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ membershipId, status }),
			})

			if (!response.ok) {
				throw new Error('Failed to update teacher status')
			}

			toast({
				title: 'Success',
				description: 'Teacher status updated successfully',
			})

			fetchTeachers()
		} catch (error) {
			console.error('Error updating teacher:', error)
			toast({
				title: 'Error',
				description: 'Failed to update teacher status',
				variant: 'destructive',
			})
		}
	}

	const handleEditTeacher = (teacher: Teacher) => {
		setEditingTeacher(teacher)
		setEditFormData({
			newPassword: '',
			avatarUrl: teacher.avatarUrl || '',
		})
		setUploadingPhoto(false)
		setIsEditDialogOpen(true)
	}

	const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Validate file type
		const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		if (!validTypes.includes(file.type)) {
			toast({
				title: 'Invalid file type',
				description: 'Please upload a PNG, JPG, GIF, or WebP image',
				variant: 'destructive',
			})
			return
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: 'File too large',
				description: 'Please upload an image smaller than 5MB',
				variant: 'destructive',
			})
			return
		}

		try {
			setUploadingPhoto(true)

			const uploadFormData = new FormData()
			uploadFormData.append('file', file)

			const response = await fetch(`/api/org/${orgSlug}/admin/photo`, {
				method: 'POST',
				body: uploadFormData,
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to upload photo')
			}

			const data = await response.json()

			// Update the avatar URL in the form
			setEditFormData({
				...editFormData,
				avatarUrl: data.avatarUrl,
			})

			toast({
				title: 'Photo uploaded',
				description: 'Profile photo has been uploaded successfully',
			})
		} catch (error) {
			console.error('Photo upload error:', error)
			toast({
				title: 'Upload failed',
				description:
					error instanceof Error ? error.message : 'Failed to upload photo',
				variant: 'destructive',
			})
		} finally {
			setUploadingPhoto(false)
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const handleSaveTeacher = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!orgSlug || !editingTeacher) return

		// Validate password if provided
		if (editFormData.newPassword && editFormData.newPassword.length < 8) {
			toast({
				title: 'Error',
				description: 'Password must be at least 8 characters long',
				variant: 'destructive',
			})
			return
		}

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/teachers`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: editingTeacher.id,
					name: editingTeacher.name,
					email: editingTeacher.email,
					avatarUrl: editFormData.avatarUrl || null,
					newPassword: editFormData.newPassword || undefined,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to update teacher')
			}

			toast({
				title: 'Success',
				description: 'Teacher updated successfully',
			})

			setIsEditDialogOpen(false)
			setEditingTeacher(null)
			setEditFormData({ newPassword: '', avatarUrl: '' })
			fetchTeachers()
		} catch (error) {
			console.error('Error updating teacher:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to update teacher',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleRemoveTeacher = async (membershipId: string) => {
		if (!orgSlug) return
		if (
			!confirm(
				'Are you sure you want to remove this teacher from the organization?'
			)
		) {
			return
		}

		try {
			const response = await fetch(
				`/api/org/${orgSlug}/teachers?membershipId=${membershipId}`,
				{
					method: 'DELETE',
				}
			)

			if (!response.ok) {
				throw new Error('Failed to remove teacher')
			}

			toast({
				title: 'Success',
				description: 'Teacher removed successfully',
			})

			fetchTeachers()
		} catch (error) {
			console.error('Error removing teacher:', error)
			toast({
				title: 'Error',
				description: 'Failed to remove teacher',
				variant: 'destructive',
			})
		}
	}

	const filteredTeachers = teachers.filter(teacher => {
		const matchesSearch =
			teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesSearch
	})

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Teachers</h1>
					<p className='text-muted-foreground mt-1'>
						Manage teachers in your organization
					</p>
				</div>
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<UserPlus className='w-4 h-4 mr-2' />
							Add Teacher
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleAddTeacher}>
							<DialogHeader>
								<DialogTitle>Add New Teacher</DialogTitle>
								<DialogDescription>
									Add a new teacher to your organization. If the email already
									exists, they will be added to your organization.
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Full Name *</Label>
									<Input
										id='name'
										placeholder='Enter full name'
										value={newTeacher.name}
										onChange={e =>
											setNewTeacher({ ...newTeacher, name: e.target.value })
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email *</Label>
									<Input
										id='email'
										type='email'
										placeholder='teacher@example.com'
										value={newTeacher.email}
										onChange={e =>
											setNewTeacher({ ...newTeacher, email: e.target.value })
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='password'>Password</Label>
									<Input
										id='password'
										type='password'
										placeholder='Leave blank to auto-generate'
										value={newTeacher.password}
										onChange={e =>
											setNewTeacher({ ...newTeacher, password: e.target.value })
										}
									/>
									<p className='text-xs text-muted-foreground'>
										If left blank, a random password will be generated
									</p>
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
									{isSubmitting ? 'Adding...' : 'Add Teacher'}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search teachers by name or email...'
								className='pl-9'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span className='font-medium'>{filteredTeachers.length}</span>
							<span>teachers</span>
						</div>
					</div>

					{loading ? (
						<div className='text-center py-12 text-muted-foreground'>
							Loading teachers...
						</div>
					) : filteredTeachers.length === 0 ? (
						<div className='text-center py-12 text-muted-foreground'>
							{searchQuery
								? 'No teachers found matching your search'
								: 'No teachers yet. Add your first teacher to get started.'}
						</div>
					) : (
						<div className='border border-border rounded-lg overflow-hidden'>
							<table className='w-full'>
								<thead className='bg-muted/50'>
									<tr>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Teacher
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Status
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Joined
										</th>
										<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
											Last Active
										</th>
										<th className='text-right p-3 text-sm font-medium text-muted-foreground'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredTeachers.map(teacher => (
										<tr
											key={teacher.id}
											className='border-t border-border hover:bg-muted/30 transition-colors'
										>
											<td className='p-3'>
												<div className='flex items-center gap-3'>
													<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
														{teacher.avatarUrl ? (
															<img
																src={teacher.avatarUrl}
																alt={teacher.name}
																className='w-10 h-10 rounded-full'
															/>
														) : (
															<span className='text-sm font-medium text-primary'>
																{teacher.name.charAt(0).toUpperCase()}
															</span>
														)}
													</div>
													<div>
														<p className='font-medium'>{teacher.name}</p>
														<p className='text-sm text-muted-foreground flex items-center gap-1'>
															<Mail className='w-3 h-3' />
															{teacher.email}
														</p>
													</div>
												</div>
											</td>
											<td className='p-3'>
												<Badge
													variant={
														teacher.status === 'active'
															? 'default'
															: 'secondary'
													}
													className={
														teacher.status === 'active'
															? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
															: teacher.status === 'suspended'
															? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
															: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
													}
												>
													{teacher.status}
												</Badge>
											</td>
											<td className='p-3 text-sm text-muted-foreground'>
												{formatDate(teacher.joinedAt)}
											</td>
											<td className='p-3 text-sm text-muted-foreground'>
												{teacher.lastActiveAt
													? formatDate(teacher.lastActiveAt)
													: 'Never'}
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
															onClick={() => handleEditTeacher(teacher)}
														>
															<Edit className='w-4 h-4 mr-2' />
															Edit Teacher
														</DropdownMenuItem>
														{teacher.status === 'active' && (
															<DropdownMenuItem
																onClick={() =>
																	handleUpdateStatus(
																		teacher.membershipId,
																		'suspended'
																	)
																}
															>
																<Ban className='w-4 h-4 mr-2' />
																Suspend
															</DropdownMenuItem>
														)}
														{teacher.status === 'suspended' && (
															<DropdownMenuItem
																onClick={() =>
																	handleUpdateStatus(
																		teacher.membershipId,
																		'active'
																	)
																}
															>
																<CheckCircle className='w-4 h-4 mr-2' />
																Activate
															</DropdownMenuItem>
														)}
														<DropdownMenuItem
															onClick={() =>
																handleRemoveTeacher(teacher.membershipId)
															}
															className='text-destructive'
														>
															<Trash2 className='w-4 h-4 mr-2' />
															Remove from Organization
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

			{/* Edit Teacher Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='max-w-2xl'>
					<form onSubmit={handleSaveTeacher}>
						<DialogHeader>
							<DialogTitle>Edit Teacher</DialogTitle>
							<DialogDescription>
								Update teacher information, password, and profile photo
							</DialogDescription>
						</DialogHeader>
						{editingTeacher && (
							<div className='space-y-4 py-4'>
								{/* Profile Photo Section */}
								<div className='space-y-2'>
									<Label>Profile Photo</Label>
									<div className='flex items-start gap-4'>
										<div className='relative'>
											<div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
												{editFormData.avatarUrl || editingTeacher.avatarUrl ? (
													<img
														src={
															editFormData.avatarUrl ||
															editingTeacher.avatarUrl ||
															''
														}
														alt={editingTeacher.name}
														className='w-full h-full object-cover'
													/>
												) : (
													<span className='text-2xl font-medium text-primary'>
														{editingTeacher.name.charAt(0).toUpperCase()}
													</span>
												)}
											</div>
											<Button
												type='button'
												size='icon'
												variant='secondary'
												className='absolute bottom-0 right-0 rounded-full w-8 h-8'
												onClick={() => fileInputRef.current?.click()}
												disabled={uploadingPhoto}
											>
												<Camera className='w-4 h-4' />
											</Button>
											<input
												ref={fileInputRef}
												type='file'
												accept='image/*'
												className='hidden'
												onChange={handlePhotoUpload}
												disabled={uploadingPhoto}
											/>
										</div>
										<div className='flex-1 space-y-2'>
											<p className='text-sm text-muted-foreground'>
												Click the camera icon to upload a new photo, or enter a
												URL below
											</p>
											<Input
												type='url'
												placeholder='https://example.com/photo.jpg'
												value={editFormData.avatarUrl}
												onChange={e =>
													setEditFormData({
														...editFormData,
														avatarUrl: e.target.value,
													})
												}
												disabled={uploadingPhoto}
											/>
											<p className='text-xs text-muted-foreground'>
												Max 5MB • PNG, JPG, GIF, WebP
											</p>
										</div>
									</div>
								</div>

								<div className='border-t pt-4'>
									<h4 className='text-sm font-semibold mb-3'>
										Basic Information
									</h4>
									<div className='space-y-3'>
										<div className='space-y-2'>
											<Label htmlFor='edit-name'>Full Name</Label>
											<Input
												id='edit-name'
												value={editingTeacher.name}
												onChange={e =>
													setEditingTeacher({
														...editingTeacher,
														name: e.target.value,
													})
												}
												required
												disabled={isSubmitting}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='edit-email'>Email</Label>
											<Input
												id='edit-email'
												type='email'
												value={editingTeacher.email}
												onChange={e =>
													setEditingTeacher({
														...editingTeacher,
														email: e.target.value,
													})
												}
												required
												disabled={isSubmitting}
											/>
										</div>
									</div>
								</div>

								<div className='border-t pt-4'>
									<h4 className='text-sm font-semibold mb-3'>
										Force Password Change
									</h4>
									<div className='space-y-2'>
										<Label htmlFor='edit-password'>
											New Password (Optional)
										</Label>
										<Input
											id='edit-password'
											type='password'
											placeholder='Leave blank to keep current password'
											value={editFormData.newPassword}
											onChange={e =>
												setEditFormData({
													...editFormData,
													newPassword: e.target.value,
												})
											}
											disabled={isSubmitting}
											minLength={8}
										/>
										<p className='text-xs text-muted-foreground'>
											If provided, the teacher's password will be changed to
											this value (min 8 characters)
										</p>
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
									setEditFormData({ newPassword: '', avatarUrl: '' })
								}}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting || uploadingPhoto}>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
