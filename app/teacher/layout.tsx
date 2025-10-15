'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/lib/theme-provider'
import type React from 'react'

export default function TeacherLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
			<SidebarProvider>
				<div className='flex min-h-screen w-full'>
					<AppSidebar role='teacher' />
					<div className='flex-1 flex flex-col'>
						<DashboardHeader />
						<main className='flex-1 p-6'>{children}</main>
					</div>
				</div>
			</SidebarProvider>
		</ThemeProvider>
	)
}
