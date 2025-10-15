'use client'

import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen, GraduationCap, MoreVertical, Users } from 'lucide-react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const userGrowthData = [
	{ month: 'Jan', users: 120 },
	{ month: 'Feb', users: 180 },
	{ month: 'Mar', users: 240 },
	{ month: 'Apr', users: 320 },
	{ month: 'May', users: 410 },
	{ month: 'Jun', users: 520 },
]

const engagementData = [
	{ day: 'Mon', active: 340 },
	{ day: 'Tue', active: 380 },
	{ day: 'Wed', active: 420 },
	{ day: 'Thu', active: 390 },
	{ day: 'Fri', active: 450 },
	{ day: 'Sat', active: 280 },
	{ day: 'Sun', active: 260 },
]

const recentCourses = [
	{
		id: 1,
		title: 'Advanced Machine Learning',
		teacher: 'Dr. Sarah Chen',
		students: 45,
		status: 'Active',
	},
	{
		id: 2,
		title: 'Web Development Fundamentals',
		teacher: 'Prof. Michael Brown',
		students: 78,
		status: 'Active',
	},
	{
		id: 3,
		title: 'Data Science Bootcamp',
		teacher: 'Dr. Emily Rodriguez',
		students: 62,
		status: 'Pending',
	},
	{
		id: 4,
		title: 'Mobile App Design',
		teacher: 'Prof. James Wilson',
		students: 34,
		status: 'Active',
	},
]

export default function AdminDashboard() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h1>
				<p className='text-muted-foreground mt-1'>
					Overview of platform performance and key metrics
				</p>
			</div>

			{/* KPI Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Total Users'
					value='1,284'
					icon={Users}
					trend={{ value: '12% from last month', positive: true }}
				/>
				<StatCard
					title='Active Teachers'
					value='156'
					icon={GraduationCap}
					trend={{ value: '8% from last month', positive: true }}
				/>
				<StatCard
					title='Active Students'
					value='1,128'
					icon={Users}
					trend={{ value: '15% from last month', positive: true }}
				/>
				<StatCard
					title='Total Courses'
					value='89'
					icon={BookOpen}
					trend={{ value: '5% from last month', positive: true }}
				/>
			</div>

			{/* Charts */}
			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>User Growth</h3>
							<p className='text-sm text-muted-foreground'>
								Total users over the last 6 months
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={userGrowthData}>
								<CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
								<XAxis
									dataKey='month'
									stroke='var(--muted-foreground)'
									fontSize={12}
								/>
								<YAxis stroke='var(--muted-foreground)' fontSize={12} />
								<Tooltip
									contentStyle={{
										backgroundColor: 'var(--popover)',
										border: '1px solid var(--border)',
										borderRadius: '8px',
									}}
								/>
								<Line
									type='monotone'
									dataKey='users'
									stroke='var(--primary)'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Daily Engagement</h3>
							<p className='text-sm text-muted-foreground'>
								Active users throughout the week
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={engagementData}>
								<CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
								<XAxis
									dataKey='day'
									stroke='var(--muted-foreground)'
									fontSize={12}
								/>
								<YAxis stroke='var(--muted-foreground)' fontSize={12} />
								<Tooltip
									contentStyle={{
										backgroundColor: 'var(--popover)',
										border: '1px solid var(--border)',
										borderRadius: '8px',
									}}
								/>
								<Bar
									dataKey='active'
									fill='var(--chart-2)'
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>

			{/* Recent Courses Table */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-lg font-semibold'>Recent Courses</h3>
							<p className='text-sm text-muted-foreground'>
								Latest courses created on the platform
							</p>
						</div>
						<Button variant='outline' size='sm'>
							View All
						</Button>
					</div>
					<div className='border border-border rounded-lg overflow-hidden'>
						<table className='w-full'>
							<thead className='bg-muted/50'>
								<tr>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Course Title
									</th>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Teacher
									</th>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Students
									</th>
									<th className='text-left p-3 text-sm font-medium text-muted-foreground'>
										Status
									</th>
									<th className='text-right p-3 text-sm font-medium text-muted-foreground'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{recentCourses.map(course => (
									<tr
										key={course.id}
										className='border-t border-border hover:bg-muted/30 transition-colors'
									>
										<td className='p-3 font-medium'>{course.title}</td>
										<td className='p-3 text-sm text-muted-foreground'>
											{course.teacher}
										</td>
										<td className='p-3 text-sm'>{course.students}</td>
										<td className='p-3'>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
													course.status === 'Active'
														? 'bg-green-500/10 text-green-500'
														: 'bg-yellow-500/10 text-yellow-500'
												}`}
											>
												{course.status}
											</span>
										</td>
										<td className='p-3 text-right'>
											<Button variant='ghost' size='icon'>
												<MoreVertical className='w-4 h-4' />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Card>
		</div>
	)
}
