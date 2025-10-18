'use client'

import {
	Award,
	BarChart3,
	BookOpen,
	FileText,
	GraduationCap,
	LayoutDashboard,
	MessageSquare,
	Settings,
	Sparkles,
	UserCircle,
	Users,
	UsersRound,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type * as React from 'react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useOrg } from '@/lib/org-context'

type NavItem = {
	title: string
	url: string
	icon: React.ComponentType<{ className?: string }>
}

type SidebarConfig = {
	admin: NavItem[]
	orgAdmin: NavItem[]
	teacher: NavItem[]
	student: NavItem[]
}

const sidebarConfig: SidebarConfig = {
	admin: [
		{ title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
		{ title: 'Organizations', url: '/admin/organizations', icon: UsersRound },
		{ title: 'User Management', url: '/admin/users', icon: Users },
		{ title: 'Course Oversight', url: '/admin/courses', icon: BookOpen },
		{ title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
		{ title: 'AI Tools', url: '/admin/ai-tools', icon: Sparkles },
		{ title: 'Settings', url: '/admin/settings', icon: Settings },
	],
	orgAdmin: [
		{ title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
		{ title: 'Students', url: '/admin/students', icon: Users },
		{ title: 'Teachers', url: '/admin/teachers', icon: GraduationCap },
		{ title: 'All Users', url: '/admin/users', icon: Users },
		{ title: 'Courses', url: '/admin/courses', icon: BookOpen },
		{ title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
		{ title: 'AI Tools', url: '/admin/ai-tools', icon: Sparkles },
		{ title: 'Settings', url: '/admin/settings', icon: Settings },
	],
	teacher: [
		{ title: 'Dashboard', url: '/teacher', icon: LayoutDashboard },
		{ title: 'My Courses', url: '/teacher/courses', icon: BookOpen },
		{ title: 'Students', url: '/teacher/students', icon: Users },
		{ title: 'Groups', url: '/teacher/groups', icon: UsersRound },
		{ title: 'AI Tools', url: '/teacher/ai-tools', icon: Sparkles },
		{ title: 'Analytics', url: '/teacher/analytics', icon: BarChart3 },
		{ title: 'Settings', url: '/teacher/settings', icon: Settings },
	],
	student: [
		{ title: 'Dashboard', url: '/student', icon: LayoutDashboard },
		{ title: 'My Courses', url: '/student/courses', icon: BookOpen },
		{ title: 'Assignments', url: '/student/assignments', icon: FileText },
		{
			title: 'AI Assistant',
			url: '/student/ai-assistant',
			icon: MessageSquare,
		},
		{ title: 'Progress', url: '/student/progress', icon: Award },
		{ title: 'Profile', url: '/student/profile', icon: UserCircle },
	],
}

export function AppSidebar({
	role,
}: {
	role: 'admin' | 'orgAdmin' | 'teacher' | 'student'
}) {
	const pathname = usePathname()
	const items = sidebarConfig[role]
	const { orgSlug } = useOrg()

	return (
		<Sidebar>
			<SidebarHeader className='border-b border-sidebar-border p-4'>
				<Link href='/' className='flex items-center gap-2'>
					<div className='w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center'>
						<GraduationCap className='w-5 h-5 text-sidebar-primary-foreground' />
					</div>
					<div className='flex flex-col'>
						<span className='text-sm font-semibold'>EduAI</span>
						<span className='text-xs text-sidebar-foreground/60 capitalize'>
							{role === 'orgAdmin' ? 'Org Admin' : role}
						</span>
					</div>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => {
								const url = orgSlug ? `/${orgSlug}${item.url}` : item.url
								const isActive = pathname === url
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={isActive}>
											<Link href={url}>
												<item.icon className='w-4 h-4' />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className='border-t border-sidebar-border p-4'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center'>
						<UserCircle className='w-5 h-5 text-sidebar-accent-foreground' />
					</div>
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-medium truncate'>Demo User</p>
						<p className='text-xs text-sidebar-foreground/60 truncate capitalize'>
							{role === 'orgAdmin' ? 'Org Admin' : role}
						</p>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
