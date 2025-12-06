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
import { Input } from '@/components/ui/label'
import { Label } from '@/components/ui/label'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Shield, ShieldOff, UserX } from 'lucide-react'
import { useEffect, useState } from 'react'

type SuperAdmin = {
	id: string
	email: string
	name: string
	isSuperAdmin: boolean
	createdAt: string
}

export default function SuperAdminsPage() {
	const [admins, setAdmins] = useState<SuperAdmin[]>([])
	const [loading, setLoading] = useState(true)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		name: '',
		password: '',
	})
	const { toast } = useToast()

	const fetchAdmins = async () => {
		try {
			const response = await fetch('/api/superadmin/admins')
			if (response.ok) {
				const data = await response.json()
				setAdmins(data.admins || [])
			}
		} catch (error) {
			console.error('Failed to fetch admins:', error)
			toast({
				title: 'Error',
				description: 'Failed to load super admins',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAdmins()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/superadmin/admins', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Super admin created successfully',
				})
				setDialogOpen(false)
				setFormData({ email: '', name: '', password: '' })
				fetchAdmins()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to create super admin',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to create admin:', error)
			toast({
				title: 'Error',
				description: 'Failed to create super admin',
				variant: 'destructive',
			})
		}
	}

	const handleToggleSuperAdmin = async (userId: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/api/superadmin/admins/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isSuperAdmin: !currentStatus }),
			})

			if (response.ok) {
				toast({
					title: 'Success',
					description: `Super admin status ${!currentStatus ? 'granted' : 'revoked'}`,
				})
				fetchAdmins()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to update status',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to update status:', error)
			toast({
				title: 'Error',
				description: 'Failed to update status',
				variant: 'destructive',
			})
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Super Admins</h1>
					<p className='text-muted-foreground mt-1'>
						Manage platform super administrators
					</p>
				</div>
				<Button
					onClick={() => {
						setFormData({ email: '', name: '', password: '' })
						setDialogOpen(true)
					}}
				>
					<Plus className='w-4 h-4 mr-2' />
					Add Super Admin
				</Button>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
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
						) : admins.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className='text-center py-8'>
									<div className='flex flex-col items-center gap-2'>
										<Shield className='w-12 h-12 text-muted-foreground' />
										<p className='text-muted-foreground'>No super admins found</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							admins.map(admin => (
								<TableRow key={admin.id}>
									<TableCell className='font-medium'>{admin.name}</TableCell>
									<TableCell>{admin.email}</TableCell>
									<TableCell>
										{admin.isSuperAdmin ? (
											<span className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500'>
												<Shield className='w-3 h-3' />
												Super Admin
											</span>
										) : (
											<span className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-500/10 text-gray-500'>
												Regular User
											</span>
										)}
									</TableCell>
									<TableCell>
										{new Date(admin.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleToggleSuperAdmin(admin.id, admin.isSuperAdmin)}
											title={admin.isSuperAdmin ? 'Revoke super admin' : 'Grant super admin'}
										>
											{admin.isSuperAdmin ? (
												<ShieldOff className='w-4 h-4' />
											) : (
												<Shield className='w-4 h-4' />
											)}
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Super Admin</DialogTitle>
						<DialogDescription>
							Create a new super administrator account
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
									placeholder='admin@example.com'
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
						</div>
						<DialogFooter className='mt-6'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type='submit'>Create Super Admin</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
