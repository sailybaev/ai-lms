'use client'

import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Building2, Shield, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type DashboardStats = {
	totalOrganizations: number
	totalUsers: number
	totalSuperAdmins: number
	activeOrganizations: number
}

export default function SuperAdminDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalOrganizations: 0,
		totalUsers: 0,
		totalSuperAdmins: 0,
		activeOrganizations: 0,
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch('/api/superadmin/stats')
				if (response.ok) {
					const data = await response.json()
					setStats(data)
				}
			} catch (error) {
				console.error('Failed to fetch stats:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchStats()
	}, [])

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Super Admin Dashboard
					</h1>
					<p className='text-muted-foreground mt-1'>
						Manage all organizations and platform administrators
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Total Organizations'
					value={loading ? '...' : stats.totalOrganizations.toString()}
					icon={Building2}
					trend={
						stats.activeOrganizations > 0
							? `${stats.activeOrganizations} active`
							: undefined
					}
				/>
				<StatCard
					title='Total Users'
					value={loading ? '...' : stats.totalUsers.toString()}
					icon={Users}
				/>
				<StatCard
					title='Super Admins'
					value={loading ? '...' : stats.totalSuperAdmins.toString()}
					icon={Shield}
				/>
				<StatCard
					title='Growth'
					value='+12%'
					icon={TrendingUp}
					trend='vs last month'
				/>
			</div>

			{/* Quick Actions */}
			<Card className='p-6'>
				<h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
				<div className='grid gap-3 md:grid-cols-3'>
					<Link href='/superadmin/organizations'>
						<Button variant='outline' className='w-full justify-start'>
							<Building2 className='w-4 h-4 mr-2' />
							Manage Organizations
						</Button>
					</Link>
					<Link href='/superadmin/admins'>
						<Button variant='outline' className='w-full justify-start'>
							<Shield className='w-4 h-4 mr-2' />
							Manage Super Admins
						</Button>
					</Link>
					<Link href='/superadmin/users'>
						<Button variant='outline' className='w-full justify-start'>
							<Users className='w-4 h-4 mr-2' />
							View All Users
						</Button>
					</Link>
				</div>
			</Card>

			{/* Recent Activity */}
			<Card className='p-6'>
				<h2 className='text-lg font-semibold mb-4'>Recent Activity</h2>
				<div className='space-y-3 text-sm'>
					<p className='text-muted-foreground'>No recent activity</p>
				</div>
			</Card>
		</div>
	)
}
