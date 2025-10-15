'use client'

import type React from 'react'
import { createContext, useContext } from 'react'

export type OrgContextValue = {
	orgSlug: string | null
}

const OrgContext = createContext<OrgContextValue>({ orgSlug: null })

export function OrgProvider({
	orgSlug,
	children,
}: {
	orgSlug: string | null
	children: React.ReactNode
}) {
	return (
		<OrgContext.Provider value={{ orgSlug }}>{children}</OrgContext.Provider>
	)
}

export function useOrg() {
	return useContext(OrgContext)
}
