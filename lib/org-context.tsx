'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

export type OrgContextValue = {
	orgSlug: string | null
	organization: {
		id: string
		name: string
		platformName: string | null
		logoUrl: string | null
	} | null
	isLoading: boolean
	refetchOrganization: () => Promise<void>
}

const OrgContext = createContext<OrgContextValue>({
	orgSlug: null,
	organization: null,
	isLoading: false,
	refetchOrganization: async () => {},
})

export function OrgProvider({
	orgSlug,
	children,
}: {
	orgSlug: string | null
	children: React.ReactNode
}) {
	const [organization, setOrganization] =
		useState<OrgContextValue['organization']>(null)
	const [isLoading, setIsLoading] = useState(false)

	const fetchOrganization = async () => {
		if (!orgSlug) return

		setIsLoading(true)
		try {
			const response = await fetch(`/api/org/${orgSlug}/branding`)
			if (response.ok) {
				const data = await response.json()
				setOrganization(data)
			}
		} catch (error) {
			console.error('Error fetching organization:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchOrganization()
	}, [orgSlug])

	return (
		<OrgContext.Provider
			value={{
				orgSlug,
				organization,
				isLoading,
				refetchOrganization: fetchOrganization,
			}}
		>
			{children}
		</OrgContext.Provider>
	)
}

export function useOrg() {
	return useContext(OrgContext)
}
