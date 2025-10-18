import { requireOrgRole } from '@/lib/auth'

export default async function OrgTeacherDashboardPage({
	params,
}: {
	params: { org: string }
}) {
	await requireOrgRole(params.org, ['teacher'])

	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-bold tracking-tight'>Teacher Dashboard</h1>
		</div>
	)
}
