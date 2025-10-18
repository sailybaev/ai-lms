'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { AuthProvider } from '@/components/auth-provider'
import { DashboardHeader } from '@/components/dashboard-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/lib/theme-provider'
import type React from 'react'

export default function AdminOrgLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<AuthProvider>
			<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
				<SidebarProvider>
					<div className='flex min-h-screen w-full'>
						<AppSidebar role='orgAdmin' />
						<div className='flex-1 flex flex-col'>
							<DashboardHeader />
							<main className='flex-1 p-6'>{children}</main>
						</div>
					</div>
				</SidebarProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}
