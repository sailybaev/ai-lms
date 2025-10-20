import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function SettingsPage() {
	return (
		<div className='space-y-6 max-w-4xl'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
				<p className='text-muted-foreground mt-1'>
					Manage your profile and preferences
				</p>
			</div>

			<Card className='p-6 space-y-6'>
				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>Profile Information</h3>
					<div className='grid gap-4 md:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='first-name'>First Name</Label>
							<Input id='first-name' defaultValue='Sarah' />
						</div>
						<div className='space-y-2'>
							<Label htmlFor='last-name'>Last Name</Label>
							<Input id='last-name' defaultValue='Chen' />
						</div>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							defaultValue='sarah.chen@eduai.com'
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='bio'>Bio</Label>
						<Textarea
							id='bio'
							rows={4}
							defaultValue='Passionate educator specializing in machine learning and data science. 10+ years of teaching experience.'
						/>
					</div>
				</div>
			</Card>

			<Card className='p-6 space-y-6'>
				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>Course Preferences</h3>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<div className='space-y-0.5'>
								<Label>Auto-approve student enrollments</Label>
								<p className='text-sm text-muted-foreground'>
									Students can join your courses without approval
								</p>
							</div>
							<Switch defaultChecked />
						</div>
						<Separator />
						<div className='flex items-center justify-between'>
							<div className='space-y-0.5'>
								<Label>Allow student discussions</Label>
								<p className='text-sm text-muted-foreground'>
									Enable discussion forums in your courses
								</p>
							</div>
							<Switch defaultChecked />
						</div>
						<Separator />
						<div className='flex items-center justify-between'>
							<div className='space-y-0.5'>
								<Label>Enable AI assistance</Label>
								<p className='text-sm text-muted-foreground'>
									Allow students to use AI study assistant
								</p>
							</div>
							<Switch defaultChecked />
						</div>
					</div>
				</div>
			</Card>

			<Card className='p-6 space-y-6'>
				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>Notifications</h3>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<div className='space-y-0.5'>
								<Label>New student enrollments</Label>
								<p className='text-sm text-muted-foreground'>
									Get notified when students join your courses
								</p>
							</div>
							<Switch defaultChecked />
						</div>
						<Separator />
						<div className='flex items-center justify-between'>
							<div className='space-y-0.5'>
								<Label>Assignment submissions</Label>
								<p className='text-sm text-muted-foreground'>
									Notify when students submit assignments
								</p>
							</div>
							<Switch defaultChecked />
						</div>
						<Separator />
						<div className='flex items-center justify-between'>
							<div className='space-y-0.5'>
								<Label>Student questions</Label>
								<p className='text-sm text-muted-foreground'>
									Get notified of new discussion posts
								</p>
							</div>
							<Switch />
						</div>
					</div>
				</div>
			</Card>

			<div className='flex justify-end gap-2'>
				<Button variant='outline'>Cancel</Button>
				<Button>Save Changes</Button>
			</div>
		</div>
	)
}
