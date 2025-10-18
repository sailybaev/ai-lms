import { requireOrgRole } from '@/lib/auth'

export default async function OrgStudentDashboardPage({
	params,
}: {
	params: Promise<{ org: string }>
}) {
	const { org } = await params
	await requireOrgRole(org, ['student'])

	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-bold tracking-tight'>Student Dashboard</h1>
			<p className='text-muted-foreground'>Welcome back.</p>
		</div>
	)
}
