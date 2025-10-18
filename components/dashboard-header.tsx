'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useOrg } from '@/lib/org-context'
import { Bell, LogOut, Moon, Search, Settings, Sun, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function DashboardHeader() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const { data: session } = useSession()
	const pathname = usePathname()
	const { orgSlug } = useOrg()

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleLogout = async () => {
		await signOut({ callbackUrl: '/' })
	}

	const getInitials = (name?: string | null) => {
		if (!name) return 'U'
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	// Determine current role from pathname
	const getCurrentRole = () => {
		if (pathname.includes('/student')) return 'student'
		if (pathname.includes('/teacher')) return 'teacher'
		if (pathname.includes('/admin')) return 'admin'
		return null
	}

	const role = getCurrentRole()
	const baseUrl = orgSlug ? `/${orgSlug}` : ''

	// Construct URLs based on role
	const profileUrl = role === 'student' ? `${baseUrl}/student/profile` : null
	const settingsUrl = role ? `${baseUrl}/${role}/settings` : null

	return (
		<header className='sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 items-center gap-4 px-4'>
				<SidebarTrigger />
				<div className='flex-1 flex items-center gap-4'>
					<div className='relative max-w-md flex-1'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Search courses, users, or content...'
							className='pl-9 bg-muted/50'
						/>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					{mounted && (
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
						>
							{theme === 'dark' ? (
								<Sun className='w-5 h-5' />
							) : (
								<Moon className='w-5 h-5' />
							)}
						</Button>
					)}
					<Button variant='ghost' size='icon' className='relative'>
						<Bell className='w-5 h-5' />
						<span className='absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full' />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='relative h-10 w-10 rounded-full'
							>
								<Avatar className='h-10 w-10'>
									<AvatarImage
										src={session?.user?.image || ''}
										alt={session?.user?.name || ''}
									/>
									<AvatarFallback>
										{getInitials(session?.user?.name)}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56' align='end' forceMount>
							<DropdownMenuLabel className='font-normal'>
								<div className='flex flex-col space-y-1'>
									<p className='text-sm font-medium leading-none'>
										{session?.user?.name || 'User'}
									</p>
									<p className='text-xs leading-none text-muted-foreground'>
										{session?.user?.email || ''}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{profileUrl && (
								<DropdownMenuItem asChild>
									<Link href={profileUrl}>
										<User className='mr-2 h-4 w-4' />
										<span>Profile</span>
									</Link>
								</DropdownMenuItem>
							)}
							{settingsUrl && (
								<DropdownMenuItem asChild>
									<Link href={settingsUrl}>
										<Settings className='mr-2 h-4 w-4' />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className='text-red-600 focus:text-red-600'
							>
								<LogOut className='mr-2 h-4 w-4' />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
