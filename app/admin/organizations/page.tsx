'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'

type Org = { id: string; slug: string; name: string }
type Domain = { id: string; domain: string }

export default function OrganizationsAdminPage() {
	const [orgs, setOrgs] = useState<Org[]>([])
	const [selectedOrg, setSelectedOrg] = useState<Org | null>(null)
	const [newOrg, setNewOrg] = useState({ slug: '', name: '' })
	const [newDomain, setNewDomain] = useState('')

	async function refresh() {
		const res = await fetch('/api/admin/orgs')
		const data = await res.json()
		setOrgs(data.orgs)
		if (selectedOrg) {
			const found = data.orgs.find((o: Org) => o.id === selectedOrg.id)
			setSelectedOrg(found ?? null)
		}
	}

	useEffect(() => {
		refresh()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	async function createOrg() {
		await fetch('/api/admin/orgs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newOrg),
		})
		setNewOrg({ slug: '', name: '' })
		await refresh()
	}

	async function addDomain(orgId: string) {
		await fetch(`/api/admin/orgs/${orgId}/domains`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ domain: newDomain }),
		})
		setNewDomain('')
		await refresh()
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Organizations</h1>
				<p className='text-muted-foreground mt-1'>
					Manage orgs and custom domains
				</p>
			</div>
			<Card className='p-4'>
				<div className='grid gap-3 md:grid-cols-3'>
					<div className='md:col-span-2 space-y-3'>
						{orgs.map(org => (
							<Card key={org.id} className='p-3'>
								<div className='flex items-center justify-between'>
									<div>
										<div className='font-medium'>{org.name}</div>
										<div className='text-xs text-muted-foreground'>
											/{org.slug}
										</div>
									</div>
									<Button
										variant='outline'
										size='sm'
										onClick={() => setSelectedOrg(org)}
									>
										Manage
									</Button>
								</div>
							</Card>
						))}
					</div>
					<div className='space-y-3'>
						<div className='space-y-2'>
							<Label htmlFor='slug'>Slug</Label>
							<Input
								id='slug'
								value={newOrg.slug}
								onChange={e => setNewOrg(o => ({ ...o, slug: e.target.value }))}
								placeholder='acme'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='name'>Name</Label>
							<Input
								id='name'
								value={newOrg.name}
								onChange={e => setNewOrg(o => ({ ...o, name: e.target.value }))}
								placeholder='Acme University'
							/>
						</div>
						<Button onClick={createOrg}>Create Organization</Button>
					</div>
				</div>
			</Card>
			{selectedOrg && (
				<Card className='p-4'>
					<div className='flex items-center justify-between'>
						<div className='font-medium'>Manage {selectedOrg.name}</div>
						<Button variant='ghost' onClick={() => setSelectedOrg(null)}>
							Close
						</Button>
					</div>
					<Separator className='my-3' />
					<div className='grid gap-3 md:grid-cols-3'>
						<div className='md:col-span-2 space-y-2'>
							<DomainsList orgId={selectedOrg.id} />
						</div>
						<div className='space-y-2'>
							<Label>Add Domain</Label>
							<Input
								value={newDomain}
								onChange={e => setNewDomain(e.target.value)}
								placeholder='acme.example.com'
							/>
							<Button
								onClick={() => addDomain(selectedOrg.id)}
								disabled={!newDomain}
							>
								Add
							</Button>
						</div>
					</div>
				</Card>
			)}
		</div>
	)
}

function DomainsList({ orgId }: { orgId: string }) {
	const [domains, setDomains] = useState<Domain[]>([])
	useEffect(() => {
		fetch(`/api/admin/orgs/${orgId}/domains`)
			.then(r => r.json())
			.then(d => setDomains(d.domains))
	}, [orgId])

	return (
		<div className='space-y-2'>
			<div className='text-sm font-medium'>Custom Domains</div>
			{domains.length === 0 ? (
				<div className='text-sm text-muted-foreground'>No domains</div>
			) : (
				<div className='space-y-1'>
					{domains.map(d => (
						<div key={d.id} className='text-sm'>
							{d.domain}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
