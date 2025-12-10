import { Role, MembershipStatus } from '@prisma/client'
import type { Session } from 'next-auth'

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: null,
  createdAt: new Date(),
  lastActiveAt: new Date(),
  passwordHash: '$2a$10$mockhashedpassword',
  isSuperAdmin: false,
  ...overrides,
})

export const createMockOrganization = (overrides = {}) => ({
  id: 'org-1',
  slug: 'test-org',
  name: 'Test Organization',
  logoUrl: null,
  settings: null,
  createdAt: new Date(),
  platformName: 'Test LMS',
  ...overrides,
})

export const createMockMembership = (overrides = {}) => ({
  id: 'membership-1',
  orgId: 'org-1',
  userId: 'user-1',
  role: 'student' as Role,
  status: 'active' as MembershipStatus,
  ...overrides,
})

export const createMockCourse = (overrides = {}) => ({
  id: 'course-1',
  orgId: 'org-1',
  title: 'Test Course',
  description: 'A test course',
  thumbnailUrl: null,
  status: 'active',
  createdById: 'user-1',
  createdAt: new Date(),
  ...overrides,
})

export const createMockGroup = (overrides = {}) => ({
  id: 'group-1',
  orgId: 'org-1',
  courseId: null,
  assignedTeacherId: null,
  name: 'Test Group',
  description: 'A test group',
  ...overrides,
})

export const createMockSession = (overrides = {}): Session => ({
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ...overrides,
})

// Mock NextAuth getServerSession
export const mockGetServerSession = (session: Session | null = null) => {
  const getServerSession = jest.fn().mockResolvedValue(session)
  jest.mock('next-auth', () => ({
    ...jest.requireActual('next-auth'),
    getServerSession,
  }))
  return getServerSession
}

// Mock Prisma queries
export const mockPrismaFindUnique = (model: string, result: any) => {
  const prismaMock = require('./prisma-mock').prismaMock
  prismaMock[model].findUnique.mockResolvedValue(result)
}

export const mockPrismaFindMany = (model: string, result: any[]) => {
  const prismaMock = require('./prisma-mock').prismaMock
  prismaMock[model].findMany.mockResolvedValue(result)
}

export const mockPrismaCreate = (model: string, result: any) => {
  const prismaMock = require('./prisma-mock').prismaMock
  prismaMock[model].create.mockResolvedValue(result)
}

export const mockPrismaUpdate = (model: string, result: any) => {
  const prismaMock = require('./prisma-mock').prismaMock
  prismaMock[model].update.mockResolvedValue(result)
}

export const mockPrismaDelete = (model: string, result: any = {}) => {
  const prismaMock = require('./prisma-mock').prismaMock
  prismaMock[model].delete.mockResolvedValue(result)
}
