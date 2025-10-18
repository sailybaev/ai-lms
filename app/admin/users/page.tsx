'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
import { useToast } from '@/hooks/use-toast'
import {
	Ban,
	CheckCircle,
	Edit,
	Mail,
	MoreVertical,
	Search,
	Shield,
	Trash2,
	UserPlus,
} from 'lucide-react'
import { useState } from 'react'

type User = {
	id: number
	name: string
	email: string
	role: string
	status: string
	joined: string
}

const mockUsers = [
	{
		id: 1,
		name: 'Alice Johnson',
		email: 'alice@example.com',
		role: 'Student',
		status: 'Active',
		joined: '2024-01-15',
	},
	{
		id: 2,
		name: 'Bob Smith',
		email: 'bob@example.com',
		role: 'Teacher',
		status: 'Active',
		joined: '2024-02-20',
	},
	{
		id: 3,
		name: 'Carol White',
		email: 'carol@example.com',
		role: 'Student',
		status: 'Active',
		joined: '2024-03-10',
	},
	{
		id: 4,
		name: 'David Brown',
		email: 'david@example.com',
		role: 'Admin',
		status: 'Active',
		joined: '2024-01-05',
	},
	{
		id: 5,
		name: 'Emma Davis',
		email: 'emma@example.com',
		role: 'Teacher',
		status: 'Suspended',
		joined: '2024-02-28',
	},
	{
		id: 6,
		name: 'Frank Miller',
		email: 'frank@example.com',
		role: 'Student',
		status: 'Active',
		joined: '2024-03-15',
	},
]

export default function UsersPage() {
	const [roleFilter, setRoleFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [users, setUsers] = useState(mockUsers)
	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()

	const filteredUsers = users.filter(user => {
		const matchesRole =
			roleFilter === 'all' || user.role.toLowerCase() === roleFilter
		const matchesSearch =
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesRole && matchesSearch
	})

	const handleEditUser = (user: User) => {
		setEditingUser({ ...user })
		setIsEditDialogOpen(true)
	}

	const handleSaveUser = async () => {
		if (!editingUser) return

		setIsLoading(true)
		try {
			// In a real app, this would call the API
			// await updateUser(editingUser.id, { name: editingUser.name, email: editingUser.email })
			// await updateUserMembership(editingUser.id, { orgId: "current-org", role: editingUser.role.toLowerCase(), status: editingUser.status.toLowerCase() })

			setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)))
			setIsEditDialogOpen(false)
			setEditingUser(null)

			toast({
				title: 'User updated',
				description: 'User information has been successfully updated.',
			})
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update user. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleConfirmDelete = async () => {
		if (!userToDelete) return

		setIsLoading(true)
		try {
			// In a real app, this would call the API
			// await deleteUser(userToDelete.id)

			setUsers(users.filter(u => u.id !== userToDelete.id))
			setUserToDelete(null)

			toast({
				title: 'User deleted',
				description: 'User has been successfully deleted.',
			})
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete user. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleToggleStatus = async (user: User) => {
		setIsLoading(true)
		try {
			const newStatus = user.status === 'Active' ? 'Suspended' : 'Active'

			// In a real app, this would call the API
			// await updateUserMembership(user.id, { orgId: "current-org", status: newStatus.toLowerCase() })

			setUsers(
				users.map(u => (u.id === user.id ? { ...u, status: newStatus } : u))
			)

			toast({
				title: 'Status updated',
				description: `User has been ${newStatus.toLowerCase()}.`,
			})
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update user status. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
					<p className='text-muted-foreground mt-1'>
						Manage all users across the platform
					</p>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button>
							<UserPlus className='w-4 h-4 mr-2' />
							Add User
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New User</DialogTitle>
							<DialogDescription>
								Create a new user account for the platform
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4 py-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Full Name</Label>
								<Input id='name' placeholder='Enter full name' />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input id='email' type='email' placeholder='user@example.com' />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='role'>Role</Label>
								<Select>
									<SelectTrigger id='role'>
										<SelectValue placeholder='Select role' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='student'>Student</SelectItem>
										<SelectItem value='teacher'>Teacher</SelectItem>
										<SelectItem value='admin'>Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button variant='outline'>Cancel</Button>
							<Button>Create User</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search users by name or email...'
								className='pl-9'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className='w-full sm:w-[180px]'>
								<SelectValue placeholder='Filter by role' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Roles</SelectItem>
								<SelectItem value='student'>Students</SelectItem>
								<SelectItem value='teacher'>Teachers</SelectItem>
								<SelectItem value='admin'>Admins</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='border border-border rounded-lg overflow-hidden'>
						<table className='w-full'>
							<thead className='bg-muted/50'>
								<tr>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										User
									</th>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Role
									</th>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Status
									</th>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Joined
									</th>
									<th className='text-right p-3 text-sm font-medium text-muted-foreground'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map(user => (
									<tr
										key={user.id}
										className='border-t border-border hover:bg-muted/30 transition-colors'
									>
										<td className='p-3'>
											<div className='flex items-center gap-3'>
												<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
													<span className='text-sm font-medium text-primary'>
														{user.name.charAt(0)}
													</span>
												</div>
												<div>
													<p className='font-medium'>{user.name}</p>
													<p className='text-sm text-muted-foreground flex items-center gap-1'>
														<Mail className='w-3 h-3' />
														{user.email}
													</p>
												</div>
											</div>
										</td>
										<td className='p-3'>
											<Badge variant='outline' className='gap-1'>
												{user.role === 'Admin' && (
													<Shield className='w-3 h-3' />
												)}
												{user.role}
											</Badge>
										</td>
										<td className='p-3'>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
													user.status === 'Active'
														? 'bg-green-500/10 text-green-500'
														: 'bg-red-500/10 text-red-500'
												}`}
											>
												{user.status}
											</span>
										</td>
										<td className='p-3 text-sm text-muted-foreground'>
											{user.joined}
										</td>
										<td className='p-3 text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon'>
														<MoreVertical className='w-4 h-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleEditUser(user)}
													>
														<Edit className='w-4 h-4 mr-2' />
														Edit User
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleToggleStatus(user)}
													>
														{user.status === 'Active' ? (
															<>
																<Ban className='w-4 h-4 mr-2' />
																Suspend User
															</>
														) : (
															<>
																<CheckCircle className='w-4 h-4 mr-2' />
																Activate User
															</>
														)}
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														variant='destructive'
														onClick={() => setUserToDelete(user)}
													>
														<Trash2 className='w-4 h-4 mr-2' />
														Delete User
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Card>

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<DialogDescription>
							Update user information and settings
						</DialogDescription>
					</DialogHeader>
					{editingUser && (
						<div className='space-y-4 py-4'>
							<div className='space-y-2'>
								<Label htmlFor='edit-name'>Full Name</Label>
								<Input
									id='edit-name'
									value={editingUser.name}
									onChange={e =>
										setEditingUser({ ...editingUser, name: e.target.value })
									}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='edit-email'>Email</Label>
								<Input
									id='edit-email'
									type='email'
									value={editingUser.email}
									onChange={e =>
										setEditingUser({ ...editingUser, email: e.target.value })
									}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='edit-role'>Role</Label>
								<Select
									value={editingUser.role.toLowerCase()}
									onValueChange={value =>
										setEditingUser({
											...editingUser,
											role: value.charAt(0).toUpperCase() + value.slice(1),
										})
									}
								>
									<SelectTrigger id='edit-role'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='student'>Student</SelectItem>
										<SelectItem value='teacher'>Teacher</SelectItem>
										<SelectItem value='admin'>Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='edit-status'>Status</Label>
								<Select
									value={editingUser.status}
									onValueChange={value =>
										setEditingUser({ ...editingUser, status: value })
									}
								>
									<SelectTrigger id='edit-status'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Active'>Active</SelectItem>
										<SelectItem value='Suspended'>Suspended</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveUser} disabled={isLoading}>
							{isLoading ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete User Confirmation Dialog */}
			<AlertDialog
				open={!!userToDelete}
				onOpenChange={open => !open && setUserToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							user <span className='font-semibold'>{userToDelete?.name}</span>{' '}
							and remove all their data from the system.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							disabled={isLoading}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							{isLoading ? 'Deleting...' : 'Delete User'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
