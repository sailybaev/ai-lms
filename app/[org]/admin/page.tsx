import { requireOrgRole } from '@/lib/auth'

export default async function OrgAdminDashboardPage({
	params,
}: {
	params: { org: string }
}) {
	await requireOrgRole(params.org, ['admin'])

	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h1>
		</div>
	)
}
