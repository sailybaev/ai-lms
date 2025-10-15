import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function OrgStudentDashboardPage() {
	const session = await getServerSession(authOptions as any)
	if (!session) redirect('./login')
	// Minimal authenticated placeholder without mock data
	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-bold tracking-tight'>Student Dashboard</h1>
			<p className='text-muted-foreground'>Welcome back.</p>
		</div>
	)
}
