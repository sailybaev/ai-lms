'use client'

import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
	BookOpen,
	ClipboardCheck,
	Sparkles,
	TrendingUp,
	Users,
} from 'lucide-react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const performanceData = [
	{ course: 'ML Advanced', score: 85 },
	{ course: 'Web Dev', score: 78 },
	{ course: 'Data Science', score: 92 },
]

const recentStudents = [
	{
		id: 1,
		name: 'Alice Johnson',
		course: 'ML Advanced',
		progress: 78,
		lastActive: '2 hours ago',
	},
	{
		id: 2,
		name: 'Bob Smith',
		course: 'Web Dev',
		progress: 65,
		lastActive: '5 hours ago',
	},
	{
		id: 3,
		name: 'Carol White',
		course: 'Data Science',
		progress: 92,
		lastActive: '1 hour ago',
	},
	{
		id: 4,
		name: 'David Brown',
		course: 'ML Advanced',
		progress: 45,
		lastActive: '1 day ago',
	},
]

export default function TeacherDashboard() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Teacher Dashboard</h1>
				<p className='text-muted-foreground mt-1'>
					Welcome back! Here's an overview of your courses
				</p>
			</div>

			{/* KPI Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Total Students'
					value='156'
					icon={Users}
					trend={{ value: '8 new this week', positive: true }}
				/>
				<StatCard
					title='Active Courses'
					value='3'
					icon={BookOpen}
					description='All courses running'
				/>
				<StatCard
					title='Pending Grading'
					value='12'
					icon={ClipboardCheck}
					description='Assignments to review'
				/>
				<StatCard
					title='Avg. Performance'
					value='85%'
					icon={TrendingUp}
					trend={{ value: '3% from last month', positive: true }}
				/>
			</div>

			{/* Charts and AI Insights */}
			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Course Performance</h3>
							<p className='text-sm text-muted-foreground'>
								Average student scores by course
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={performanceData}>
								<CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
								<XAxis
									dataKey='course'
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
									dataKey='score'
									fill='var(--primary)'
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='space-y-4'>
						<div className='flex items-start gap-3'>
							<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
								<Sparkles className='w-5 h-5 text-primary' />
							</div>
							<div className='flex-1'>
								<h3 className='text-lg font-semibold'>AI Insights</h3>
								<p className='text-sm text-muted-foreground'>
									Personalized recommendations for your courses
								</p>
							</div>
						</div>
						<div className='space-y-3'>
							<div className='p-3 rounded-lg bg-muted/50 border border-border'>
								<p className='text-sm font-medium'>High Engagement Alert</p>
								<p className='text-xs text-muted-foreground mt-1'>
									Your Data Science course has 92% completion rate - consider
									creating advanced content
								</p>
							</div>
							<div className='p-3 rounded-lg bg-muted/50 border border-border'>
								<p className='text-sm font-medium'>Student Support Needed</p>
								<p className='text-xs text-muted-foreground mt-1'>
									4 students in ML Advanced are falling behind - consider
									scheduling office hours
								</p>
							</div>
							<div className='p-3 rounded-lg bg-muted/50 border border-border'>
								<p className='text-sm font-medium'>Content Suggestion</p>
								<p className='text-xs text-muted-foreground mt-1'>
									Students are requesting more practical examples in Web Dev
									course
								</p>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{/* Recent Students Activity */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-lg font-semibold'>Recent Student Activity</h3>
							<p className='text-sm text-muted-foreground'>
								Track your students' progress
							</p>
						</div>
						<Button variant='outline' size='sm'>
							View All Students
						</Button>
					</div>
					<div className='space-y-3'>
						{recentStudents.map(student => (
							<div
								key={student.id}
								className='flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'
							>
								<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
									<span className='text-sm font-medium text-primary'>
										{student.name.charAt(0)}
									</span>
								</div>
								<div className='flex-1 min-w-0'>
									<p className='font-medium truncate'>{student.name}</p>
									<p className='text-xs text-muted-foreground'>
										{student.course}
									</p>
								</div>
								<div className='flex items-center gap-3 min-w-[200px]'>
									<div className='flex-1'>
										<Progress value={student.progress} className='h-2' />
									</div>
									<span className='text-sm font-medium w-12 text-right'>
										{student.progress}%
									</span>
								</div>
								<span className='text-xs text-muted-foreground whitespace-nowrap'>
									{student.lastActive}
								</span>
							</div>
						))}
					</div>
				</div>
			</Card>
		</div>
	)
}
