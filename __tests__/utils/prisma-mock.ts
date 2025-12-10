import { prisma } from '@/lib/db'

// Export the mocked prisma instance
export const prismaMock = prisma as jest.Mocked<typeof prisma>

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

export default prismaMock
