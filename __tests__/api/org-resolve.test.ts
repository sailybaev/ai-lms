import { GET } from '@/app/api/org/resolve/route'
import { prismaMock } from '../utils/prisma-mock'
import { createMockOrganization } from '../utils/test-helpers'
import { NextRequest } from 'next/server'

describe('API /api/org/resolve', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return orgSlug for exact domain match', async () => {
    const mockOrg = createMockOrganization({ slug: 'acme' })
    const mockDomain = {
      id: 'domain-1',
      orgId: mockOrg.id,
      domain: 'acme.com',
      verifiedAt: new Date(),
      org: mockOrg,
    }

    prismaMock.organizationDomain.findUnique.mockResolvedValue(mockDomain as any)

    const url = 'http://localhost:3000/api/org/resolve?host=acme.com'
    const req = new NextRequest(url)

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ orgSlug: 'acme' })
    expect(prismaMock.organizationDomain.findUnique).toHaveBeenCalledWith({
      where: { domain: 'acme.com' },
      include: { org: true },
    })
  })

  it('should return orgSlug for subdomain match when exact domain not found', async () => {
    const mockOrg = createMockOrganization({ slug: 'acme' })

    prismaMock.organizationDomain.findUnique.mockResolvedValue(null)
    prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)

    const url = 'http://localhost:3000/api/org/resolve?host=acme.example.com'
    const req = new NextRequest(url)

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ orgSlug: 'acme' })
    expect(prismaMock.organization.findUnique).toHaveBeenCalledWith({
      where: { slug: 'acme' },
    })
  })

  it('should return null when no matching domain or subdomain', async () => {
    prismaMock.organizationDomain.findUnique.mockResolvedValue(null)
    prismaMock.organization.findUnique.mockResolvedValue(null)

    const url = 'http://localhost:3000/api/org/resolve?host=unknown.com'
    const req = new NextRequest(url)

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ orgSlug: null })
  })

  it('should not use subdomain for www', async () => {
    prismaMock.organizationDomain.findUnique.mockResolvedValue(null)

    const url = 'http://localhost:3000/api/org/resolve?host=www.example.com'
    const req = new NextRequest(url)

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ orgSlug: null })
    expect(prismaMock.organization.findUnique).not.toHaveBeenCalled()
  })

  it('should return 400 when host parameter is missing', async () => {
    const url = 'http://localhost:3000/api/org/resolve'
    const req = new NextRequest(url)

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'host required' })
  })

  it('should handle database errors gracefully', async () => {
    prismaMock.organizationDomain.findUnique.mockRejectedValue(
      new Error('Database connection error')
    )

    const url = 'http://localhost:3000/api/org/resolve?host=test.com'
    const req = new NextRequest(url)

    // Should not throw and return null
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ orgSlug: null })
  })
})
