'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useOrg } from '@/lib/org-context'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
	const { orgSlug, organization, isLoading, refetchOrganization } = useOrg()
	const { toast } = useToast()
	const [platformName, setPlatformName] = useState('')
	const [logoUrl, setLogoUrl] = useState('')
	const [isSaving, setIsSaving] = useState(false)

	useEffect(() => {
		if (organization) {
			setPlatformName(organization.platformName || '')
			setLogoUrl(organization.logoUrl || '')
		}
	}, [organization])

	const handleSave = async () => {
		if (!orgSlug) return

		setIsSaving(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/branding`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					platformName: platformName || null,
					logoUrl: logoUrl || null,
				}),
			})

			if (response.ok) {
				await refetchOrganization()
				toast({
					title: 'Success',
					description: 'Branding settings saved successfully',
				})
			} else {
				throw new Error('Failed to save settings')
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to save branding settings',
				variant: 'destructive',
			})
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		if (organization) {
			setPlatformName(organization.platformName || '')
			setLogoUrl(organization.logoUrl || '')
		}
	}

	if (isLoading) {
		return (
			<div className='space-y-6 max-w-4xl'>
				<div>
					<Skeleton className='h-9 w-48' />
					<Skeleton className='h-5 w-96 mt-1' />
				</div>
				<Card className='p-6'>
					<Skeleton className='h-6 w-32 mb-4' />
					<div className='space-y-4'>
						<Skeleton className='h-10 w-full' />
						<Skeleton className='h-10 w-full' />
					</div>
				</Card>
			</div>
		)
	}

	return (
		<div className='space-y-6 max-w-4xl'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
				<p className='text-muted-foreground mt-1'>
					Manage organization branding and preferences
				</p>
			</div>

			<Card className='p-6 space-y-6'>
				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>Branding</h3>
					<p className='text-sm text-muted-foreground'>
						Customize your organization's platform name and logo
					</p>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='platform-name'>Platform Name</Label>
							<Input
								id='platform-name'
								placeholder='EduAI'
								value={platformName}
								onChange={e => setPlatformName(e.target.value)}
							/>
							<p className='text-xs text-muted-foreground'>
								This name will appear in the sidebar and throughout the platform
							</p>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='logo-url'>Logo URL</Label>
							<Input
								id='logo-url'
								placeholder='https://example.com/logo.png'
								value={logoUrl}
								onChange={e => setLogoUrl(e.target.value)}
							/>
							<p className='text-xs text-muted-foreground'>
								Provide a URL to your organization's logo image
							</p>
						</div>
						{logoUrl && (
							<div className='space-y-2'>
								<Label>Logo Preview</Label>
								<div className='border rounded-lg p-4 bg-muted/50 flex items-center justify-center'>
									<img
										src={logoUrl}
										alt='Logo preview'
										className='max-w-[200px] max-h-[100px] object-contain'
										onError={e => {
											const target = e.target as HTMLImageElement
											target.style.display = 'none'
										}}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</Card>

			<div className='flex justify-end gap-2'>
				<Button variant='outline' onClick={handleCancel} disabled={isSaving}>
					Cancel
				</Button>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</div>
	)
}
