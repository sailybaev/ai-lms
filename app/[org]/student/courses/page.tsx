import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function OrgStudentCoursesPage() {
	const session = await getServerSession(authOptions as any)
	if (!session) redirect('../login')
	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-bold tracking-tight'>My Courses</h1>
			<p className='text-muted-foreground'>No data yet.</p>
		</div>
	)
}
