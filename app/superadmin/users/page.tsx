'use client'

import { Card } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

type User = {
	id: string
	email: string
	name: string
	isSuperAdmin: boolean
	createdAt: string
	_count?: {
		memberships: number
	}
}

export default function AllUsersPage() {
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const { toast } = useToast()

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch('/api/superadmin/users')
				if (response.ok) {
					const data = await response.json()
					setUsers(data.users || [])
				}
			} catch (error) {
				console.error('Failed to fetch users:', error)
				toast({
					title: 'Error',
					description: 'Failed to load users',
					variant: 'destructive',
				})
			} finally {
				setLoading(false)
			}
		}
		fetchUsers()
	}, [])

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>All Users</h1>
					<p className='text-muted-foreground mt-1'>
						View all users across all organizations
					</p>
				</div>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Organizations</TableHead>
							<TableHead>Created</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} className='text-center py-8'>
									Loading...
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className='text-center py-8'>
									<div className='flex flex-col items-center gap-2'>
										<Users className='w-12 h-12 text-muted-foreground' />
										<p className='text-muted-foreground'>No users found</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							users.map(user => (
								<TableRow key={user.id}>
									<TableCell className='font-medium'>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{user.isSuperAdmin ? (
											<span className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500'>
												<Shield className='w-3 h-3' />
												Super Admin
											</span>
										) : (
											<span className='text-xs text-muted-foreground'>User</span>
										)}
									</TableCell>
									<TableCell>{user._count?.memberships || 0}</TableCell>
									<TableCell>
										{new Date(user.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	)
}
