'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') || '/superadmin'

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			})

			if (result?.error) {
				setError('Invalid email or password')
			} else if (result?.ok) {
				router.push(callbackUrl)
				router.refresh()
			}
		} catch (error) {
			setError('An error occurred. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='flex justify-center mb-4'>
						<div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
							<Shield className='w-8 h-8 text-primary' />
						</div>
					</div>
					<CardTitle className='text-2xl'>Welcome Back</CardTitle>
					<CardDescription>
						Sign in to access the platform
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='your-email@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete='email'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='••••••••'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete='current-password'
							/>
						</div>
						{error && (
							<div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
								{error}
							</div>
						)}
						<Button
							type='submit'
							className='w-full'
							disabled={loading}
						>
							{loading ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>
					<div className='mt-6 text-center text-xs text-muted-foreground'>
						<p>Default credentials for testing:</p>
						<p className='mt-1 font-mono'>superadmin@example.com / SuperAdmin123!</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
