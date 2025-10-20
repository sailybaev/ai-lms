import { Card } from '@/components/ui/card'
import { Award, Flame, Target, TrendingUp } from 'lucide-react'
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

const weeklyProgress = [
	{ week: 'Week 1', hours: 8 },
	{ week: 'Week 2', hours: 12 },
	{ week: 'Week 3', hours: 10 },
	{ week: 'Week 4', hours: 15 },
]

const courseProgress = [
	{ course: 'ML Advanced', progress: 78 },
	{ course: 'Web Dev', progress: 45 },
	{ course: 'Data Science', progress: 92 },
]

const achievements = [
	{
		title: 'First Course Completed',
		description: 'Completed your first course',
		date: '2025-01-10',
		earned: true,
	},
	{
		title: 'Week Warrior',
		description: 'Studied 7 days in a row',
		date: '2025-01-12',
		earned: true,
	},
	{
		title: 'Perfect Score',
		description: 'Got 100% on an assignment',
		date: 'Not yet',
		earned: false,
	},
	{
		title: 'Course Master',
		description: 'Complete 5 courses',
		date: 'Not yet',
		earned: false,
	},
]

export default function ProgressPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>My Progress</h1>
				<p className='text-muted-foreground mt-1'>
					Track your learning journey and achievements
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-4'>
				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Total Hours
							</p>
							<p className='text-3xl font-bold'>47h</p>
						</div>
						<TrendingUp className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Study Streak
							</p>
							<p className='text-3xl font-bold'>12 days</p>
						</div>
						<Flame className='w-8 h-8 text-orange-500' />
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Avg. Score
							</p>
							<p className='text-3xl font-bold'>85%</p>
						</div>
						<Target className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>
				<Card className='p-6'>
					<div className='flex items-start justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-muted-foreground'>
								Achievements
							</p>
							<p className='text-3xl font-bold'>8</p>
						</div>
						<Award className='w-8 h-8 text-muted-foreground' />
					</div>
				</Card>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>Weekly Study Hours</h3>
							<p className='text-sm text-muted-foreground'>
								Your study time over the past month
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={weeklyProgress}>
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
									dataKey='hours'
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
							<h3 className='text-lg font-semibold'>Course Progress</h3>
							<p className='text-sm text-muted-foreground'>
								Completion status by course
							</p>
						</div>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={courseProgress}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='hsl(var(--border))'
								/>
								<XAxis
									dataKey='course'
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
									dataKey='progress'
									fill='hsl(var(--chart-2))'
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div>
						<h3 className='text-lg font-semibold'>Achievements</h3>
						<p className='text-sm text-muted-foreground'>
							Your learning milestones
						</p>
					</div>
					<div className='grid gap-4 md:grid-cols-2'>
						{achievements.map((achievement, index) => (
							<Card
								key={index}
								className={`p-4 ${
									achievement.earned
										? 'border-primary/50 bg-primary/5'
										: 'opacity-60'
								}`}
							>
								<div className='flex items-start gap-4'>
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center ${
											achievement.earned ? 'bg-primary/20' : 'bg-muted'
										}`}
									>
										<Award
											className={`w-6 h-6 ${
												achievement.earned
													? 'text-primary'
													: 'text-muted-foreground'
											}`}
										/>
									</div>
									<div className='flex-1'>
										<h4 className='font-semibold'>{achievement.title}</h4>
										<p className='text-sm text-muted-foreground mt-1'>
											{achievement.description}
										</p>
										<p className='text-xs text-muted-foreground mt-2'>
											{achievement.earned
												? `Earned on ${achievement.date}`
												: 'Not earned yet'}
										</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</Card>
		</div>
	)
}
