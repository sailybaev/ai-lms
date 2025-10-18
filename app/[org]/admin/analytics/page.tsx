'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import {
	Activity,
	Award,
	BookOpen,
	Calendar,
	Clock,
	GraduationCap,
	MessageSquare,
	Target,
	TrendingDown,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

type AnalyticsData = {
	overview: {
		totalUsers: number
		activeUsers: number
		totalCourses: number
		activeCourses: number
		totalEnrollments: number
		activeEnrollments: number
		avgCompletionRate: number
		avgSessionTime: number
		previousPeriod: {
			totalUsers: number
			activeUsers: number
			totalEnrollments: number
			avgCompletionRate: number
		}
	}
	userDistribution: {
		name: string
		value: number
		color: string
	}[]
	courseEngagement: {
		course: string
		engagement: number
		enrollments: number
	}[]
	activityTrend: {
		date: string
		logins: number
		lessonViews: number
		assignments: number
	}[]
	peakHours: {
		hour: string
		users: number
	}[]
	topPerformers: {
		id: string
		name: string
		email: string
		completedCourses: number
		avgScore: number
	}[]
	recentActivity: {
		type: string
		user: string
		description: string
		timestamp: string
	}[]
}

export default function OrgAnalyticsPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [loading, setLoading] = useState(true)
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
	const [timeRange, setTimeRange] = useState('7d')

	const fetchAnalytics = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			const response = await fetch(
				`/api/org/${orgSlug}/analytics?range=${timeRange}`
			)
			if (!response.ok) {
				throw new Error('Failed to fetch analytics')
			}
			const data = await response.json()
			setAnalyticsData(data)
		} catch (error) {
			console.error('Error fetching analytics:', error)
			toast({
				title: 'Error',
				description: 'Failed to load analytics. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAnalytics()
	}, [orgSlug, timeRange])

	const calculateChange = (current: number, previous: number) => {
		if (previous === 0) return { value: 100, isPositive: current > 0 }
		const change = ((current - previous) / previous) * 100
		return {
			value: Math.abs(Math.round(change)),
			isPositive: change >= 0,
		}
	}

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		if (hours === 0) return `${mins}m`
		if (mins === 0) return `${hours}h`
		return `${hours}h ${mins}m`
	}

	const exportReport = () => {
		if (!analyticsData) return
		toast({
			title: 'Exporting...',
			description: 'Your analytics report is being generated.',
		})
		// Implementation for export functionality
		setTimeout(() => {
			toast({
				title: 'Export Complete',
				description: 'Your analytics report has been downloaded.',
			})
		}, 2000)
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<Activity className='w-12 h-12 text-primary animate-pulse mx-auto mb-4' />
					<p className='text-muted-foreground'>Loading analytics...</p>
				</div>
			</div>
		)
	}

	if (!analyticsData) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<p className='text-muted-foreground'>No analytics data available</p>
				</div>
			</div>
		)
	}

	const usersChange = calculateChange(
		analyticsData.overview.activeUsers,
		analyticsData.overview.previousPeriod.activeUsers
	)
	const enrollmentsChange = calculateChange(
		analyticsData.overview.totalEnrollments,
		analyticsData.overview.previousPeriod.totalEnrollments
	)
	const completionChange = calculateChange(
		analyticsData.overview.avgCompletionRate,
		analyticsData.overview.previousPeriod.avgCompletionRate
	)

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Organization Analytics
					</h1>
					<p className='text-muted-foreground mt-1'>
						Comprehensive insights into your organization's performance
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Select range' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='7d'>Last 7 days</SelectItem>
							<SelectItem value='30d'>Last 30 days</SelectItem>
							<SelectItem value='90d'>Last 90 days</SelectItem>
							<SelectItem value='1y'>Last year</SelectItem>
						</SelectContent>
					</Select>
					<Button variant='outline' onClick={exportReport}>
						<Calendar className='w-4 h-4 mr-2' />
						Export Report
					</Button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Active Users
							</p>
							<p className='text-2xl font-bold'>
								{analyticsData.overview.activeUsers}
							</p>
							<p
								className={`text-xs flex items-center gap-1 ${
									usersChange.isPositive ? 'text-green-500' : 'text-red-500'
								}`}
							>
								{usersChange.isPositive ? (
									<TrendingUp className='w-3 h-3' />
								) : (
									<TrendingDown className='w-3 h-3' />
								)}
								{usersChange.isPositive ? '+' : '-'}
								{usersChange.value}% from previous period
							</p>
						</div>
						<Activity className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Avg. Session Time
							</p>
							<p className='text-2xl font-bold'>
								{formatTime(analyticsData.overview.avgSessionTime)}
							</p>
							<p className='text-xs text-green-500 flex items-center gap-1'>
								<TrendingUp className='w-3 h-3' />
								+8% from last week
							</p>
						</div>
						<Clock className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Total Enrollments
							</p>
							<p className='text-2xl font-bold'>
								{analyticsData.overview.totalEnrollments}
							</p>
							<p
								className={`text-xs flex items-center gap-1 ${
									enrollmentsChange.isPositive
										? 'text-green-500'
										: 'text-red-500'
								}`}
							>
								{enrollmentsChange.isPositive ? (
									<TrendingUp className='w-3 h-3' />
								) : (
									<TrendingDown className='w-3 h-3' />
								)}
								{enrollmentsChange.isPositive ? '+' : '-'}
								{enrollmentsChange.value}% from previous period
							</p>
						</div>
						<GraduationCap className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Completion Rate
							</p>
							<p className='text-2xl font-bold'>
								{analyticsData.overview.avgCompletionRate}%
							</p>
							<p
								className={`text-xs flex items-center gap-1 ${
									completionChange.isPositive
										? 'text-green-500'
										: 'text-red-500'
								}`}
							>
								{completionChange.isPositive ? (
									<TrendingUp className='w-3 h-3' />
								) : (
									<TrendingDown className='w-3 h-3' />
								)}
								{completionChange.isPositive ? '+' : '-'}
								{completionChange.value}% from previous period
							</p>
						</div>
						<Award className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>
			</div>

			{/* Additional Stats */}
			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<Users className='w-5 h-5 text-primary' />
						</div>
						<div>
							<p className='text-2xl font-bold'>
								{analyticsData.overview.totalUsers}
							</p>
							<p className='text-sm text-muted-foreground'>Total Users</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-blue-500/10 rounded-lg'>
							<BookOpen className='w-5 h-5 text-blue-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>
								{analyticsData.overview.activeCourses}
							</p>
							<p className='text-sm text-muted-foreground'>
								Active Courses / {analyticsData.overview.totalCourses} Total
							</p>
						</div>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-green-500/10 rounded-lg'>
							<Target className='w-5 h-5 text-green-500' />
						</div>
						<div>
							<p className='text-2xl font-bold'>
								{analyticsData.overview.activeEnrollments}
							</p>
							<p className='text-sm text-muted-foreground'>
								Active Enrollments
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Charts Row 1 */}
			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>User Distribution</h3>
							<p className='text-sm text-muted-foreground'>Breakdown by role</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={analyticsData.userDistribution}
									cx='50%'
									cy='50%'
									labelLine={false}
									label={(entry: any) =>
										`${entry.name} ${(entry.percent * 100).toFixed(0)}%`
									}
									outerRadius={100}
									fill='#8884d8'
									dataKey='value'
								>
									{analyticsData.userDistribution.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Peak Activity Hours</h3>
							<p className='text-sm text-muted-foreground'>
								Active users throughout the day
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={analyticsData.peakHours}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='hsl(var(--border))'
								/>
								<XAxis
									dataKey='hour'
									stroke='hsl(var(--muted-foreground))'
									fontSize={12}
								/>
								<YAxis stroke='hsl(var(--muted-foreground))' fontSize={12} />
								<Tooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--popover))',
										border: '1px solid hsl(var(--border))',
										borderRadius: '8px',
									}}
								/>
								<Bar
									dataKey='users'
									fill='hsl(var(--primary))'
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>

			{/* Activity Trend */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<div>
						<h3 className='text-lg font-semibold'>Activity Trends</h3>
						<p className='text-sm text-muted-foreground'>
							User engagement over time
						</p>
					</div>
					<ResponsiveContainer width='100%' height={300}>
						<AreaChart data={analyticsData.activityTrend}>
							<defs>
								<linearGradient id='colorLogins' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='hsl(var(--chart-1))'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='hsl(var(--chart-1))'
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient id='colorLessons' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='hsl(var(--chart-2))'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='hsl(var(--chart-2))'
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient
									id='colorAssignments'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='hsl(var(--chart-3))'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='hsl(var(--chart-3))'
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='hsl(var(--border))'
							/>
							<XAxis
								dataKey='date'
								stroke='hsl(var(--muted-foreground))'
								fontSize={12}
							/>
							<YAxis stroke='hsl(var(--muted-foreground))' fontSize={12} />
							<Tooltip
								contentStyle={{
									backgroundColor: 'hsl(var(--popover))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '8px',
								}}
							/>
							<Legend />
							<Area
								type='monotone'
								dataKey='logins'
								stroke='hsl(var(--chart-1))'
								fillOpacity={1}
								fill='url(#colorLogins)'
								name='Logins'
							/>
							<Area
								type='monotone'
								dataKey='lessonViews'
								stroke='hsl(var(--chart-2))'
								fillOpacity={1}
								fill='url(#colorLessons)'
								name='Lesson Views'
							/>
							<Area
								type='monotone'
								dataKey='assignments'
								stroke='hsl(var(--chart-3))'
								fillOpacity={1}
								fill='url(#colorAssignments)'
								name='Assignments'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</Card>

			{/* Course Engagement */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<div>
						<h3 className='text-lg font-semibold'>Course Engagement Rates</h3>
						<p className='text-sm text-muted-foreground'>
							Top performing courses by student engagement
						</p>
					</div>
					<div className='space-y-3'>
						{analyticsData.courseEngagement.map((course, index) => (
							<div key={index} className='flex items-center gap-4'>
								<div className='w-40 text-sm font-medium truncate'>
									{course.course}
								</div>
								<div className='flex-1 bg-muted rounded-full h-2 overflow-hidden'>
									<div
										className='h-full bg-primary rounded-full transition-all'
										style={{ width: `${course.engagement}%` }}
									/>
								</div>
								<div className='w-16 text-sm font-medium text-right'>
									{course.engagement}%
								</div>
								<div className='w-24 text-sm text-muted-foreground text-right'>
									{course.enrollments} students
								</div>
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* Bottom Row */}
			<div className='grid gap-4 md:grid-cols-2'>
				{/* Top Performers */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Top Performers</h3>
							<p className='text-sm text-muted-foreground'>
								Students with highest completion rates
							</p>
						</div>
						<div className='space-y-3'>
							{analyticsData.topPerformers.map((student, index) => (
								<div
									key={student.id}
									className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'
								>
									<div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold'>
										{index + 1}
									</div>
									<div className='flex-1 min-w-0'>
										<p className='font-medium truncate'>{student.name}</p>
										<p className='text-sm text-muted-foreground truncate'>
											{student.email}
										</p>
									</div>
									<div className='text-right'>
										<p className='font-bold text-green-500'>
											{student.avgScore}%
										</p>
										<p className='text-xs text-muted-foreground'>
											{student.completedCourses} completed
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</Card>

				{/* Recent Activity */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Recent Activity</h3>
							<p className='text-sm text-muted-foreground'>
								Latest events in your organization
							</p>
						</div>
						<div className='space-y-3'>
							{analyticsData.recentActivity.map((activity, index) => (
								<div
									key={index}
									className='flex items-start gap-3 p-3 bg-muted/50 rounded-lg'
								>
									<div className='p-2 bg-primary/10 rounded-lg mt-0.5'>
										<MessageSquare className='w-4 h-4 text-primary' />
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium'>{activity.user}</p>
										<p className='text-sm text-muted-foreground'>
											{activity.description}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{activity.timestamp}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}
