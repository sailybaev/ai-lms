import { ProfileForm } from '@/components/profile-form'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { requireOrgRole } from '@/lib/auth'
import { getUserProfile } from '@/lib/user-profile'
import { Award, BookOpen, Clock } from 'lucide-react'

async function getProfile(org: string, email: string) {
	const profile = await getUserProfile(email, org)
	return profile
}

export default async function ProfilePage({
	params,
}: {
	params: { org: string }
}) {
	const { email } = await requireOrgRole(params.org, ['student'])
	const data = await getProfile(params.org, email)

	if (!data) {
		return <div>Profile not found</div>
	}

	return (
		<div className='space-y-6 max-w-4xl'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
				<p className='text-muted-foreground mt-1'>
					Manage your account and preferences
				</p>
			</div>

			<ProfileForm user={data.user} />

			<Card className='p-6'>
				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>Learning Stats</h3>
					<div className='grid gap-4 md:grid-cols-3'>
						<div className='flex items-center gap-3 p-4 rounded-lg bg-muted/50'>
							<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
								<BookOpen className='w-6 h-6 text-primary' />
							</div>
							<div>
								<p className='text-2xl font-bold'>
									{data.stats.coursesEnrolled}
								</p>
								<p className='text-sm text-muted-foreground'>
									Courses Enrolled
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-4 rounded-lg bg-muted/50'>
							<div className='w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center'>
								<Clock className='w-6 h-6 text-accent' />
							</div>
							<div>
								<p className='text-2xl font-bold'>{data.stats.totalActivity}</p>
								<p className='text-sm text-muted-foreground'>
									Total Activities
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-4 rounded-lg bg-muted/50'>
							<div className='w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center'>
								<Award className='w-6 h-6 text-chart-2' />
							</div>
							<div>
								<p className='text-2xl font-bold'>
									{data.stats.assignmentsCompleted}
								</p>
								<p className='text-sm text-muted-foreground'>
									Assignments Completed
								</p>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{data.enrollments && data.enrollments.length > 0 && (
				<Card className='p-6'>
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Enrolled Courses</h3>
						<div className='space-y-2'>
							{data.enrollments.map((enrollment: any) => (
								<div
									key={enrollment.id}
									className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
								>
									<div>
										<p className='font-medium'>{enrollment.courseTitle}</p>
										<p className='text-sm text-muted-foreground capitalize'>
											{enrollment.status}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</Card>
			)}

			<Card className='p-6'>
				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>Account Information</h3>
					<div className='space-y-3'>
						<div>
							<Label className='text-sm text-muted-foreground'>Role</Label>
							<p className='font-medium capitalize'>{data.membership.role}</p>
						</div>
						<Separator />
						<div>
							<Label className='text-sm text-muted-foreground'>Status</Label>
							<p className='font-medium capitalize'>{data.membership.status}</p>
						</div>
						<Separator />
						<div>
							<Label className='text-sm text-muted-foreground'>
								Member Since
							</Label>
							<p className='font-medium'>
								{new Date(data.user.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}

function Label({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return <label className={className}>{children}</label>
}
