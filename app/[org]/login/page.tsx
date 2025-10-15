'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { signIn } from 'next-auth/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function OrgLoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const search = useSearchParams()
	const params = useParams<{ org: string }>()
	const router = useRouter()

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		const callbackUrl = search.get('callbackUrl') || `/${params.org}/student`
		const res = await signIn('credentials', {
			email,
			password,
			redirect: false,
			callbackUrl,
		})
		setLoading(false)
		if (res?.ok) router.push(callbackUrl)
	}

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<Card className='w-full max-w-sm p-6 space-y-4'>
				<div>
					<h1 className='text-2xl font-semibold'>Sign in</h1>
					<p className='text-sm text-muted-foreground'>to {params.org}</p>
				</div>
				<form onSubmit={onSubmit} className='space-y-3'>
					<div className='space-y-2'>
						<label className='text-sm'>Email</label>
						<Input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm'>Password</label>
						<Input
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>
			</Card>
		</div>
	)
}
