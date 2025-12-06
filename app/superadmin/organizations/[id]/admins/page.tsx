'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Plus, Shield, Trash, UserCog } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type OrgMember = {
	id: string
	userId: string
	role: 'admin' | 'teacher' | 'student'
	status: 'active' | 'invited' | 'suspended'
	user: {
		id: string
		email: string
		name: string
	}
}

type Organization = {
	id: string
	name: string
	slug: string
}

export default function OrgAdminsPage() {
	const params = useParams()
	const router = useRouter()
	const { toast } = useToast()
	const orgId = params.id as string

	const [organization, setOrganization] = useState<Organization | null>(null)
	const [members, setMembers] = useState<OrgMember[]>([])
	const [loading, setLoading] = useState(true)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		name: '',
		password: '',
		role: 'admin' as 'admin' | 'teacher' | 'student',
	})

	const fetchData = async () => {
		try {
			const [orgRes, membersRes] = await Promise.all([
				fetch(`/api/superadmin/organizations/${orgId}`),
				fetch(`/api/superadmin/organizations/${orgId}/members`),
			])

			if (orgRes.ok) {
				const orgData = await orgRes.json()
				setOrganization(orgData.organization)
			}

			if (membersRes.ok) {
				const membersData = await membersRes.json()
				setMembers(membersData.members || [])
			}
		} catch (error) {
			console.error('Failed to fetch data:', error)
			toast({
				title: 'Error',
				description: 'Failed to load organization members',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [orgId])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const response = await fetch(
				`/api/superadmin/organizations/${orgId}/members`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				}
			)

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'User added to organization successfully',
				})
				setDialogOpen(false)
				setFormData({ email: '', name: '', password: '', role: 'admin' })
				fetchData()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to add user',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to add user:', error)
			toast({
				title: 'Error',
				description: 'Failed to add user',
				variant: 'destructive',
			})
		}
	}

	const handleRemove = async (membershipId: string) => {
		if (!confirm('Are you sure you want to remove this user?')) return

		try {
			const response = await fetch(
				`/api/superadmin/organizations/${orgId}/members/${membershipId}`,
				{
					method: 'DELETE',
				}
			)

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'User removed successfully',
				})
				fetchData()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to remove user',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to remove user:', error)
			toast({
				title: 'Error',
				description: 'Failed to remove user',
				variant: 'destructive',
			})
		}
	}

	const handleChangeRole = async (membershipId: string, newRole: string) => {
		try {
			const response = await fetch(
				`/api/superadmin/organizations/${orgId}/members/${membershipId}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ role: newRole }),
				}
			)

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Role updated successfully',
				})
				fetchData()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to update role',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to update role:', error)
			toast({
				title: 'Error',
				description: 'Failed to update role',
				variant: 'destructive',
			})
		}
	}

	const admins = members.filter(m => m.role === 'admin')
	const teachers = members.filter(m => m.role === 'teacher')
	const students = members.filter(m => m.role === 'student')

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-4'>
				<Link href='/superadmin/organizations'>
					<Button variant='ghost' size='sm'>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Back
					</Button>
				</Link>
			</div>

			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						{organization?.name || 'Organization'} - Members
					</h1>
					<p className='text-muted-foreground mt-1'>
						Manage users and their roles in this organization
					</p>
				</div>
				<Button onClick={() => setDialogOpen(true)}>
					<Plus className='w-4 h-4 mr-2' />
					Add User
				</Button>
			</div>

			{/* Stats */}
			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-red-500/10 rounded-lg'>
							<Shield className='w-5 h-5 text-red-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>{admins.length}</p>
							<p className='text-sm text-muted-foreground'>Admins</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-blue-500/10 rounded-lg'>
							<UserCog className='w-5 h-5 text-blue-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>{teachers.length}</p>
							<p className='text-sm text-muted-foreground'>Teachers</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-green-500/10 rounded-lg'>
							<UserCog className='w-5 h-5 text-green-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>{students.length}</p>
							<p className='text-sm text-muted-foreground'>Students</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Members Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} className='text-center py-8'>
									Loading...
								</TableCell>
							</TableRow>
						) : members.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className='text-center py-8'>
									<div className='flex flex-col items-center gap-2'>
										<UserCog className='w-12 h-12 text-muted-foreground' />
										<p className='text-muted-foreground'>No members found</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							members.map(member => (
								<TableRow key={member.id}>
									<TableCell className='font-medium'>
										{member.user.name}
									</TableCell>
									<TableCell>{member.user.email}</TableCell>
									<TableCell>
										<Select
											value={member.role}
											onValueChange={value =>
												handleChangeRole(member.id, value)
											}
										>
											<SelectTrigger className='w-32'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='admin'>Admin</SelectItem>
												<SelectItem value='teacher'>Teacher</SelectItem>
												<SelectItem value='student'>Student</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
												member.status === 'active'
													? 'bg-green-500/10 text-green-500'
													: member.status === 'invited'
													? 'bg-blue-500/10 text-blue-500'
													: 'bg-gray-500/10 text-gray-500'
											}`}
										>
											{member.status}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleRemove(member.id)}
										>
											<Trash className='w-4 h-4' />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>

			{/* Add User Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add User to Organization</DialogTitle>
						<DialogDescription>
							Create a new user or add an existing user to this organization
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className='space-y-4'>
							<div>
								<Label htmlFor='name'>Name *</Label>
								<Input
									id='name'
									value={formData.name}
									onChange={e =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder='John Doe'
									required
								/>
							</div>
							<div>
								<Label htmlFor='email'>Email *</Label>
								<Input
									id='email'
									type='email'
									value={formData.email}
									onChange={e =>
										setFormData({ ...formData, email: e.target.value })
									}
									placeholder='user@example.com'
									required
								/>
							</div>
							<div>
								<Label htmlFor='password'>Password *</Label>
								<Input
									id='password'
									type='password'
									value={formData.password}
									onChange={e =>
										setFormData({ ...formData, password: e.target.value })
									}
									placeholder='••••••••'
									required
									minLength={8}
								/>
								<p className='text-xs text-muted-foreground mt-1'>
									Minimum 8 characters
								</p>
							</div>
							<div>
								<Label htmlFor='role'>Role *</Label>
								<Select
									value={formData.role}
									onValueChange={value =>
										setFormData({
											...formData,
											role: value as 'admin' | 'teacher' | 'student',
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='admin'>Admin</SelectItem>
										<SelectItem value='teacher'>Teacher</SelectItem>
										<SelectItem value='student'>Student</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter className='mt-6'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type='submit'>Add User</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
