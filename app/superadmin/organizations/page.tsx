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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Building2, Edit, MoreVertical, Plus, Trash, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Organization = {
	id: string
	slug: string
	name: string
	platformName?: string | null
	createdAt: string
	_count?: {
		memberships: number
		courses: number
	}
}

export default function OrganizationsPage() {
	const [organizations, setOrganizations] = useState<Organization[]>([])
	const [loading, setLoading] = useState(true)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
	const [formData, setFormData] = useState({
		slug: '',
		name: '',
		platformName: '',
	})
	const { toast } = useToast()

	const fetchOrganizations = async () => {
		try {
			const response = await fetch('/api/admin/orgs')
			if (response.ok) {
				const data = await response.json()
				setOrganizations(data.orgs || [])
			}
		} catch (error) {
			console.error('Failed to fetch organizations:', error)
			toast({
				title: 'Error',
				description: 'Failed to load organizations',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchOrganizations()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const url = editingOrg
				? `/api/admin/orgs/${editingOrg.id}`
				: '/api/admin/orgs'
			const method = editingOrg ? 'PUT' : 'POST'

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				toast({
					title: 'Success',
					description: `Organization ${editingOrg ? 'updated' : 'created'} successfully`,
				})
				setDialogOpen(false)
				setFormData({ slug: '', name: '', platformName: '' })
				setEditingOrg(null)
				fetchOrganizations()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to save organization',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to save organization:', error)
			toast({
				title: 'Error',
				description: 'Failed to save organization',
				variant: 'destructive',
			})
		}
	}

	const handleEdit = (org: Organization) => {
		setEditingOrg(org)
		setFormData({
			slug: org.slug,
			name: org.name,
			platformName: org.platformName || '',
		})
		setDialogOpen(true)
	}

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this organization?')) return

		try {
			const response = await fetch(`/api/admin/orgs/${id}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Organization deleted successfully',
				})
				fetchOrganizations()
			} else {
				const data = await response.json()
				toast({
					title: 'Error',
					description: data.error || 'Failed to delete organization',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Failed to delete organization:', error)
			toast({
				title: 'Error',
				description: 'Failed to delete organization',
				variant: 'destructive',
			})
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Organizations</h1>
					<p className='text-muted-foreground mt-1'>
						Manage all platform organizations
					</p>
				</div>
				<Button
					onClick={() => {
						setEditingOrg(null)
						setFormData({ slug: '', name: '', platformName: '' })
						setDialogOpen(true)
					}}
				>
					<Plus className='w-4 h-4 mr-2' />
					Add Organization
				</Button>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Platform Name</TableHead>
							<TableHead>Members</TableHead>
							<TableHead>Courses</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} className='text-center py-8'>
									Loading...
								</TableCell>
							</TableRow>
						) : organizations.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className='text-center py-8'>
									<div className='flex flex-col items-center gap-2'>
										<Building2 className='w-12 h-12 text-muted-foreground' />
										<p className='text-muted-foreground'>No organizations found</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							organizations.map(org => (
								<TableRow key={org.id}>
									<TableCell className='font-medium'>{org.name}</TableCell>
									<TableCell>
										<code className='text-xs bg-muted px-2 py-1 rounded'>
											{org.slug}
										</code>
									</TableCell>
									<TableCell>{org.platformName || '-'}</TableCell>
									<TableCell>{org._count?.memberships || 0}</TableCell>
									<TableCell>{org._count?.courses || 0}</TableCell>
									<TableCell>
										{new Date(org.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex items-center justify-end gap-2'>
											<Link href={`/superadmin/organizations/${org.id}/admins`}>
												<Button variant='ghost' size='sm'>
													<Users className='w-4 h-4 mr-1' />
													Members
												</Button>
											</Link>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => handleEdit(org)}
											>
												<Edit className='w-4 h-4' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => handleDelete(org.id)}
											>
												<Trash className='w-4 h-4' />
											</Button>
										</div>
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
						<DialogTitle>
							{editingOrg ? 'Edit Organization' : 'Add Organization'}
						</DialogTitle>
						<DialogDescription>
							{editingOrg
								? 'Update organization details'
								: 'Create a new organization'}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className='space-y-4'>
							<div>
								<Label htmlFor='slug'>Slug *</Label>
								<Input
									id='slug'
									value={formData.slug}
									onChange={e =>
										setFormData({ ...formData, slug: e.target.value })
									}
									placeholder='my-org'
									required
									disabled={!!editingOrg}
								/>
								<p className='text-xs text-muted-foreground mt-1'>
									Used in URLs (cannot be changed after creation)
								</p>
							</div>
							<div>
								<Label htmlFor='name'>Organization Name *</Label>
								<Input
									id='name'
									value={formData.name}
									onChange={e =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder='My Organization'
									required
								/>
							</div>
							<div>
								<Label htmlFor='platformName'>Platform Name</Label>
								<Input
									id='platformName'
									value={formData.platformName}
									onChange={e =>
										setFormData({ ...formData, platformName: e.target.value })
									}
									placeholder='Optional custom platform name'
								/>
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
							<Button type='submit'>
								{editingOrg ? 'Update' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
