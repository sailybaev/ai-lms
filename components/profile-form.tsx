'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Camera, Key, User } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

interface ProfileFormProps {
	user: {
		id: string
		email: string
		name: string
		avatarUrl: string | null
	}
}

export function ProfileForm({ user }: ProfileFormProps) {
	const { toast } = useToast()
	const params = useParams<{ org: string }>()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: user.name,
		avatarUrl: user.avatarUrl || '',
	})
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [uploadingPhoto, setUploadingPhoto] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const res = await fetch(`/api/org/${params.org}/profile`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					avatarUrl: formData.avatarUrl || null,
				}),
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Failed to update profile')
			}

			toast({
				title: 'Profile updated',
				description: 'Your profile has been updated successfully.',
			})

			router.refresh()
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to update profile',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleCancel = () => {
		setFormData({
			name: user.name,
			avatarUrl: user.avatarUrl || '',
		})
	}

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault()

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast({
				title: 'Error',
				description: 'New passwords do not match',
				variant: 'destructive',
			})
			return
		}

		if (passwordData.newPassword.length < 8) {
			toast({
				title: 'Error',
				description: 'Password must be at least 8 characters long',
				variant: 'destructive',
			})
			return
		}

		setLoading(true)

		try {
			const res = await fetch(`/api/org/${params.org}/profile/password`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					currentPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
				}),
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Failed to change password')
			}

			toast({
				title: 'Password changed',
				description: 'Your password has been updated successfully.',
			})

			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			})
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to change password',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast({
				title: 'Error',
				description: 'Please select an image file',
				variant: 'destructive',
			})
			return
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: 'Error',
				description: 'Image size must be less than 5MB',
				variant: 'destructive',
			})
			return
		}

		setUploadingPhoto(true)

		try {
			const uploadFormData = new FormData()
			uploadFormData.append('file', file)

			const res = await fetch(`/api/org/${params.org}/profile/photo`, {
				method: 'POST',
				body: uploadFormData,
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Failed to upload photo')
			}

			setFormData(prev => ({ ...prev, avatarUrl: data.avatarUrl }))

			toast({
				title: 'Photo uploaded',
				description: 'Your profile photo has been updated successfully.',
			})

			router.refresh()
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to upload photo',
				variant: 'destructive',
			})
		} finally {
			setUploadingPhoto(false)
		}
	}

	const hasChanges =
		formData.name !== user.name || formData.avatarUrl !== (user.avatarUrl || '')

	return (
		<Tabs defaultValue='profile' className='space-y-6'>
			<TabsList>
				<TabsTrigger value='profile' className='gap-2'>
					<User className='w-4 h-4' />
					Profile
				</TabsTrigger>
				<TabsTrigger value='security' className='gap-2'>
					<Key className='w-4 h-4' />
					Security
				</TabsTrigger>
			</TabsList>

			<TabsContent value='profile' className='space-y-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<Card className='p-6'>
						<div className='space-y-6'>
							<div className='flex items-start gap-6'>
								<div className='relative'>
									<div className='w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary overflow-hidden'>
										{formData.avatarUrl || user.avatarUrl ? (
											<img
												src={formData.avatarUrl || user.avatarUrl || ''}
												alt={user.name}
												className='w-full h-full object-cover'
											/>
										) : (
											getInitials(formData.name || user.name)
										)}
									</div>
									<Button
										type='button'
										size='icon'
										variant='secondary'
										className='absolute bottom-0 right-0 rounded-full w-8 h-8'
										onClick={() => fileInputRef.current?.click()}
										disabled={uploadingPhoto}
									>
										<Camera className='w-4 h-4' />
									</Button>
									<input
										ref={fileInputRef}
										type='file'
										accept='image/*'
										className='hidden'
										onChange={handlePhotoUpload}
										disabled={uploadingPhoto}
									/>
								</div>
								<div className='flex-1 space-y-4'>
									<div className='space-y-2'>
										<Label htmlFor='name'>Full Name</Label>
										<Input
											id='name'
											value={formData.name}
											onChange={e =>
												setFormData({ ...formData, name: e.target.value })
											}
											required
											disabled={loading}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='email'>Email</Label>
										<Input
											id='email'
											type='email'
											value={user.email}
											disabled
										/>
										<p className='text-xs text-muted-foreground'>
											Email cannot be changed
										</p>
									</div>
								</div>
							</div>

							<Separator />

							<div className='space-y-2'>
								<Label htmlFor='avatarUrl'>Avatar URL (Optional)</Label>
								<Input
									id='avatarUrl'
									type='url'
									placeholder='https://example.com/avatar.jpg'
									value={formData.avatarUrl}
									onChange={e =>
										setFormData({ ...formData, avatarUrl: e.target.value })
									}
									disabled={loading}
								/>
								<p className='text-xs text-muted-foreground'>
									You can also provide a URL to your profile picture
								</p>
							</div>
						</div>
					</Card>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={handleCancel}
							disabled={loading || !hasChanges}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={loading || !hasChanges}>
							{loading ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</TabsContent>

			<TabsContent value='security' className='space-y-6'>
				<form onSubmit={handlePasswordChange} className='space-y-6'>
					<Card className='p-6'>
						<div className='space-y-4'>
							<div>
								<h3 className='text-lg font-semibold'>Change Password</h3>
								<p className='text-sm text-muted-foreground'>
									Update your password to keep your account secure
								</p>
							</div>

							<Separator />

							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='currentPassword'>Current Password</Label>
									<Input
										id='currentPassword'
										type='password'
										value={passwordData.currentPassword}
										onChange={e =>
											setPasswordData({
												...passwordData,
												currentPassword: e.target.value,
											})
										}
										required
										disabled={loading}
										autoComplete='current-password'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='newPassword'>New Password</Label>
									<Input
										id='newPassword'
										type='password'
										value={passwordData.newPassword}
										onChange={e =>
											setPasswordData({
												...passwordData,
												newPassword: e.target.value,
											})
										}
										required
										disabled={loading}
										autoComplete='new-password'
										minLength={8}
									/>
									<p className='text-xs text-muted-foreground'>
										Must be at least 8 characters long
									</p>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirmPassword'>Confirm New Password</Label>
									<Input
										id='confirmPassword'
										type='password'
										value={passwordData.confirmPassword}
										onChange={e =>
											setPasswordData({
												...passwordData,
												confirmPassword: e.target.value,
											})
										}
										required
										disabled={loading}
										autoComplete='new-password'
										minLength={8}
									/>
								</div>
							</div>
						</div>
					</Card>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() =>
								setPasswordData({
									currentPassword: '',
									newPassword: '',
									confirmPassword: '',
								})
							}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={loading}>
							{loading ? 'Changing...' : 'Change Password'}
						</Button>
					</div>
				</form>
			</TabsContent>
		</Tabs>
	)
}
