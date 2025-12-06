import { requireSuperAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SuperAdminClientLayout from './layout-client'

export default async function SuperAdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	try {
		await requireSuperAdmin()
	} catch (error) {
		redirect('/')
	}

	return <SuperAdminClientLayout>{children}</SuperAdminClientLayout>
}
