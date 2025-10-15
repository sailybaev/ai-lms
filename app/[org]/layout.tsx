import { AuthProvider } from '@/components/auth-provider'
import { OrgProvider } from '@/lib/org-context'
import type React from 'react'

export default async function OrgLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ org: string }> | { org: string }
}) {
	const p = params instanceof Promise ? await params : params
	const orgSlug = p?.org ?? null
	return (
		<AuthProvider>
			<OrgProvider orgSlug={orgSlug}>{children}</OrgProvider>
		</AuthProvider>
	)
}
