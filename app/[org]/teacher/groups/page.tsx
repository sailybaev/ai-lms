'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import { Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

type Group = {
	id: string
	name: string
	description: string | null
	courseId: string | null
	courseName: string | null
	members: {
		id: string
		name: string
		email: string
		avatarUrl: string | null
	}[]
}

export default function GroupsPage() {
	const { orgSlug } = useOrg()
	const { toast } = useToast()
	const [groups, setGroups] = useState<Group[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [courseFilter, setCourseFilter] = useState('all')

	const fetchGroups = async () => {
		if (!orgSlug) return

		try {
			setLoading(true)
			const response = await fetch(`/api/org/${orgSlug}/teacher/groups`)
			if (!response.ok) {
				throw new Error('Failed to fetch groups')
			}
			const data = await response.json()
			setGroups(data.groups)
		} catch (error) {
			console.error('Error fetching groups:', error)
			toast({
				title: 'Error',
				description: 'Failed to load groups. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchGroups()
	}, [orgSlug])

	const filteredGroups = groups.filter(group => {
		const matchesCourse =
			courseFilter === 'all' || group.courseId === courseFilter
		const matchesSearch = group.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
		return matchesCourse && matchesSearch
	})

	// Get unique courses from groups
	const uniqueCourses = Array.from(
		new Set(groups.map(g => g.courseId).filter(Boolean))
	).map(courseId => {
		const group = groups.find(g => g.courseId === courseId)
		return {
			id: courseId!,
			name: group?.courseName || '',
		}
	})

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Groups</h1>
					<p className='text-muted-foreground mt-1'>
						View student groups assigned to you
					</p>
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Groups
						</p>
						<p className='text-3xl font-bold'>{groups.length}</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Students
						</p>
						<p className='text-3xl font-bold'>
							{groups.reduce((acc, group) => acc + group.members.length, 0)}
						</p>
					</div>
				</Card>
				<Card className='p-6'>
					<div className='space-y-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Avg. Group Size
						</p>
						<p className='text-3xl font-bold'>
							{groups.length > 0
								? Math.round(
										groups.reduce((acc, group) => acc + group.members.length, 0) /
											groups.length
								  )
								: 0}
						</p>
					</div>
				</Card>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search groups...'
								className='pl-9'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select value={courseFilter} onValueChange={setCourseFilter}>
							<SelectTrigger className='w-full sm:w-[200px]'>
								<SelectValue placeholder='Filter by course' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Courses</SelectItem>
								{uniqueCourses.map(course => (
									<SelectItem key={course.id} value={course.id}>
										{course.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{loading ? (
						<div className='text-center py-12 text-muted-foreground'>
							Loading groups...
						</div>
					) : filteredGroups.length === 0 ? (
						<div className='text-center py-12'>
							<div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4'>
								<Users className='w-8 h-8 text-primary' />
							</div>
							<h3 className='text-lg font-semibold mb-2'>No groups found</h3>
							<p className='text-muted-foreground max-w-md mx-auto'>
								{searchQuery || courseFilter !== 'all'
									? 'Try adjusting your filters to find groups.'
									: 'You don\'t have any groups assigned yet. Contact your administrator to be assigned to groups.'}
							</p>
						</div>
					) : (
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{filteredGroups.map(group => (
								<Card
									key={group.id}
									className='p-4 hover:border-primary/50 transition-colors'
								>
									<div className='space-y-4'>
										<div className='flex items-start justify-between'>
											<div className='flex items-center gap-3'>
												<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
													<Users className='w-5 h-5 text-primary' />
												</div>
												<div>
													<h3 className='font-semibold'>{group.name}</h3>
													<p className='text-xs text-muted-foreground'>
														{group.members.length} member
														{group.members.length !== 1 ? 's' : ''}
													</p>
												</div>
											</div>
										</div>
										{group.description && (
											<p className='text-sm text-muted-foreground line-clamp-2'>
												{group.description}
											</p>
										)}
										{group.courseName && (
											<Badge variant='outline'>{group.courseName}</Badge>
										)}
										<div className='space-y-2'>
											<p className='text-xs font-medium text-muted-foreground'>
												Members:
											</p>
											<div className='space-y-1'>
												{group.members.slice(0, 3).map(member => (
													<div
														key={member.id}
														className='flex items-center gap-2 text-sm'
													>
														<div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
															<span className='text-xs text-primary'>
																{member.name.charAt(0)}
															</span>
														</div>
														<span className='truncate'>{member.name}</span>
													</div>
												))}
												{group.members.length > 3 && (
													<p className='text-xs text-muted-foreground pl-8'>
														+{group.members.length - 3} more
													</p>
												)}
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
