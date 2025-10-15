import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { type FC } from 'react'

const OrgTeacherCourseDetailPage: FC = async () => {
	const session = await getServerSession(authOptions as any)
	if (!session) redirect('../../login')
	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-bold tracking-tight'>Course</h1>
			<p className='text-muted-foreground'>No data yet.</p>
		</div>
	)
}

export default OrgTeacherCourseDetailPage
