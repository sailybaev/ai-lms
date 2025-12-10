import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import {
  requireAuth,
  isSuperAdmin,
  requireSuperAdmin,
  getUserOrgRole,
  requireOrgRole,
} from '@/lib/auth'
import { prismaMock } from '../utils/prisma-mock'
import {
  createMockUser,
  createMockOrganization,
  createMockMembership,
  createMockSession,
} from '../utils/test-helpers'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

// Mock authOptions
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}))

describe('lib/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('requireAuth', () => {
    it('should return session when user is authenticated', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const result = await requireAuth()

      expect(result).toEqual(mockSession)
      expect(getServerSession).toHaveBeenCalledTimes(1)
    })

    it('should return null when user is not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const result = await requireAuth()

      expect(result).toBeNull()
    })
  })

  describe('isSuperAdmin', () => {
    it('should return true when user is a super admin', async () => {
      const mockUser = createMockUser({ isSuperAdmin: true })
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await isSuperAdmin('test@example.com')

      expect(result).toBe(true)
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { isSuperAdmin: true },
      })
    })

    it('should return false when user is not a super admin', async () => {
      const mockUser = createMockUser({ isSuperAdmin: false })
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await isSuperAdmin('test@example.com')

      expect(result).toBe(false)
    })

    it('should return false when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await isSuperAdmin('nonexistent@example.com')

      expect(result).toBe(false)
    })
  })

  describe('requireSuperAdmin', () => {
    it('should return email when user is a super admin', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockUser = createMockUser({ isSuperAdmin: true })
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await requireSuperAdmin()

      expect(result).toEqual({ email: 'test@example.com' })
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should redirect to login when no session', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      // Should try to redirect, which throws
      try {
        await requireSuperAdmin()
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/login?callbackUrl=/superadmin')
    })

    it('should redirect to home when user is not a super admin', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockUser = createMockUser({ isSuperAdmin: false })
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      // Should try to redirect, which throws
      try {
        await requireSuperAdmin()
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/')
    })
  })

  describe('getUserOrgRole', () => {
    it('should return user role in organization', async () => {
      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const mockMembership = createMockMembership({
        role: 'admin' as Role,
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [mockMembership],
      } as any)

      const result = await getUserOrgRole('test@example.com', 'test-org')

      expect(result).toBe('admin')
      expect(prismaMock.organization.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-org' },
      })
    })

    it('should return null when organization does not exist', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(null)

      const result = await getUserOrgRole('test@example.com', 'nonexistent-org')

      expect(result).toBeNull()
    })

    it('should return null when user does not exist', async () => {
      const mockOrg = createMockOrganization()
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await getUserOrgRole('nonexistent@example.com', 'test-org')

      expect(result).toBeNull()
    })

    it('should return null when user has no active membership', async () => {
      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [],
      } as any)

      const result = await getUserOrgRole('test@example.com', 'test-org')

      expect(result).toBeNull()
    })

    it('should only return active memberships', async () => {
      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const activeMembership = createMockMembership({
        role: 'teacher' as Role,
        status: 'active',
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [activeMembership],
      } as any)

      const result = await getUserOrgRole('test@example.com', 'test-org')

      expect(result).toBe('teacher')
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: {
          memberships: {
            where: {
              orgId: mockOrg.id,
              status: 'active',
            },
          },
        },
      })
    })
  })

  describe('requireOrgRole', () => {
    it('should return role and email when user has required role', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const mockMembership = createMockMembership({
        role: 'admin' as Role,
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [mockMembership],
      } as any)

      const result = await requireOrgRole('test-org', ['admin', 'teacher'])

      expect(result).toEqual({
        role: 'admin',
        email: 'test@example.com',
      })
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should redirect to login when no session', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      try {
        await requireOrgRole('test-org', ['admin'])
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/test-org/login')
    })

    it('should redirect to login when user has no role', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockOrg = createMockOrganization()
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue(null)

      try {
        await requireOrgRole('test-org', ['admin'])
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/test-org/login')
    })

    it('should redirect to student page when user is student but admin required', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const mockMembership = createMockMembership({
        role: 'student' as Role,
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [mockMembership],
      } as any)

      try {
        await requireOrgRole('test-org', ['admin'])
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/test-org/student')
    })

    it('should redirect to teacher page when user is teacher but admin required', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const mockMembership = createMockMembership({
        role: 'teacher' as Role,
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [mockMembership],
      } as any)

      try {
        await requireOrgRole('test-org', ['admin'])
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/test-org/teacher')
    })

    it('should redirect to admin page when user is admin but student required', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const mockMembership = createMockMembership({
        role: 'admin' as Role,
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [mockMembership],
      } as any)

      try {
        await requireOrgRole('test-org', ['student'])
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/test-org/admin')
    })

    it('should allow access when user has one of multiple allowed roles', async () => {
      const mockSession = createMockSession()
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const mockOrg = createMockOrganization()
      const mockUser = createMockUser()
      const mockMembership = createMockMembership({
        role: 'teacher' as Role,
      })

      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        memberships: [mockMembership],
      } as any)

      const result = await requireOrgRole('test-org', ['admin', 'teacher'])

      expect(result).toEqual({
        role: 'teacher',
        email: 'test@example.com',
      })
      expect(redirect).not.toHaveBeenCalled()
    })
  })
})
