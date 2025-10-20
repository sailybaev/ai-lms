import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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

const completionData = [
	{ week: 'Week 1', rate: 95 },
	{ week: 'Week 2', rate: 88 },
	{ week: 'Week 3', rate: 82 },
	{ week: 'Week 4', rate: 78 },
	{ week: 'Week 5', rate: 75 },
	{ week: 'Week 6', rate: 72 },
]

const engagementData = [
	{ lesson: 'Intro', views: 78, completion: 95 },
	{ lesson: 'Basics', views: 72, completion: 88 },
	{ lesson: 'Advanced', views: 65, completion: 75 },
	{ lesson: 'Practice', views: 58, completion: 68 },
	{ lesson: 'Project', views: 45, completion: 52 },
]

const topStudents = [
	{ name: 'Carol White', score: 98, progress: 100 },
	{ name: 'Emma Davis', score: 95, progress: 98 },
	{ name: 'Alice Johnson', score: 92, progress: 95 },
	{ name: 'Frank Miller', score: 88, progress: 92 },
	{ name: 'Bob Smith', score: 85, progress: 88 },
]

export default function AnalyticsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
				<p className='text-muted-foreground mt-1'>
					Detailed insights into course performance
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Completion Rate Trend</h3>
							<p className='text-sm text-muted-foreground'>
								Student completion over time
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={completionData}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='hsl(var(--border))'
								/>
								<XAxis
									dataKey='week'
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
								<Line
									type='monotone'
									dataKey='rate'
									stroke='hsl(var(--primary))'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Lesson Engagement</h3>
							<p className='text-sm text-muted-foreground'>
								Views vs completion by lesson
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={engagementData}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='hsl(var(--border))'
								/>
								<XAxis
									dataKey='lesson'
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
									dataKey='views'
									fill='hsl(var(--chart-1))'
									radius={[8, 8, 0, 0]}
								/>
								<Bar
									dataKey='completion'
									fill='hsl(var(--chart-2))'
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Top Performing Students</h3>
							<p className='text-sm text-muted-foreground'>
								Students with highest scores
							</p>
						</div>
						<div className='space-y-3'>
							{topStudents.map((student, index) => (
								<div key={index} className='flex items-center gap-4'>
									<div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
										<span className='text-sm font-medium text-primary'>
											{index + 1}
										</span>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='font-medium truncate'>{student.name}</p>
										<div className='flex items-center gap-2 mt-1'>
											<Progress
												value={student.progress}
												className='flex-1 h-1.5'
											/>
											<span className='text-xs text-muted-foreground'>
												{student.progress}%
											</span>
										</div>
									</div>
									<div className='text-right'>
										<p className='text-lg font-bold'>{student.score}</p>
										<p className='text-xs text-muted-foreground'>score</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Low Engagement Areas</h3>
							<p className='text-sm text-muted-foreground'>
								Lessons needing attention
							</p>
						</div>
						<div className='space-y-3'>
							<div className='p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20'>
								<div className='flex items-start justify-between gap-2'>
									<div>
										<p className='font-medium text-yellow-500'>
											Project Module
										</p>
										<p className='text-sm text-muted-foreground mt-1'>
											Only 52% completion rate
										</p>
									</div>
									<span className='text-2xl font-bold text-yellow-500'>
										52%
									</span>
								</div>
							</div>
							<div className='p-4 rounded-lg bg-orange-500/10 border border-orange-500/20'>
								<div className='flex items-start justify-between gap-2'>
									<div>
										<p className='font-medium text-orange-500'>
											Practice Exercises
										</p>
										<p className='text-sm text-muted-foreground mt-1'>
											68% completion, below average
										</p>
									</div>
									<span className='text-2xl font-bold text-orange-500'>
										68%
									</span>
								</div>
							</div>
							<div className='p-4 rounded-lg bg-red-500/10 border border-red-500/20'>
								<div className='flex items-start justify-between gap-2'>
									<div>
										<p className='font-medium text-red-500'>Advanced Topics</p>
										<p className='text-sm text-muted-foreground mt-1'>
											High dropout rate at 75%
										</p>
									</div>
									<span className='text-2xl font-bold text-red-500'>75%</span>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}
