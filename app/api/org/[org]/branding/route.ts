import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/org/[org]/branding - Get organization branding
export async function GET(
	request: NextRequest,
	context: { params: Promise<{ org: string }> | { org: string } }
) {
	try {
		const params =
			context.params instanceof Promise ? await context.params : context.params
		const { org: orgSlug } = params

		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
			select: {
				id: true,
				name: true,
				platformName: true,
				logoUrl: true,
			} as Prisma.OrganizationSelect,
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(organization)
	} catch (error) {
		console.error('Error fetching organization branding:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch organization branding' },
			{ status: 500 }
		)
	}
}

// PATCH /api/org/[org]/branding - Update organization branding
export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ org: string }> | { org: string } }
) {
	try {
		const params =
			context.params instanceof Promise ? await context.params : context.params
		const { org: orgSlug } = params
		const body = await request.json()

		const { platformName, logoUrl } = body

		// Validate input
		if (
			platformName !== undefined &&
			platformName !== null &&
			typeof platformName !== 'string'
		) {
			return NextResponse.json(
				{ error: 'platformName must be a string' },
				{ status: 400 }
			)
		}

		if (
			logoUrl !== undefined &&
			logoUrl !== null &&
			typeof logoUrl !== 'string'
		) {
			return NextResponse.json(
				{ error: 'logoUrl must be a string or null' },
				{ status: 400 }
			)
		}

		// Validate organization exists
		const organization = await prisma.organization.findUnique({
			where: { slug: orgSlug },
		})

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			)
		}

		// Build update data object
		const updateData: Record<string, string | null> = {}
		if (platformName !== undefined) {
			updateData.platformName = platformName
		}
		if (logoUrl !== undefined) {
			updateData.logoUrl = logoUrl
		}

		// Check if there's anything to update
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ error: 'No valid fields to update' },
				{ status: 400 }
			)
		}

		// Update organization branding
		const updatedOrganization = await prisma.organization.update({
			where: { slug: orgSlug },
			data: updateData as Prisma.OrganizationUpdateInput,
			select: {
				id: true,
				name: true,
				platformName: true,
				logoUrl: true,
			} as Prisma.OrganizationSelect,
		})

		return NextResponse.json(updatedOrganization)
	} catch (error) {
		console.error('Error updating organization branding:', error)
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error'
		return NextResponse.json(
			{
				error: 'Failed to update organization branding',
				details: errorMessage,
			},
			{ status: 500 }
		)
	}
}
