import { GET, POST, PUT, DELETE } from '@/app/api/org/[org]/admin/groups/route'
import { prismaMock } from '../utils/prisma-mock'
import {
  createMockUser,
  createMockOrganization,
  createMockMembership,
  createMockGroup,
  createMockSession,
  createMockCourse,
} from '../utils/test-helpers'
import {
  createMockRequest,
  createMockParams,
  mockAuthSession,
  mockNoAuthSession,
} from '../utils/api-test-helpers'
import { getServerSession } from 'next-auth'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock authOptions
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}))

describe('API /api/org/[org]/admin/groups', () => {
  const mockOrg = createMockOrganization({ slug: 'test-org' })
  const mockAdmin = createMockUser({ email: 'admin@test.com' })
  const mockSession = createMockSession({ user: { ...mockAdmin } })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET - List groups', () => {
    it('should return groups for authenticated admin', async () => {
      const mockGroups = [
        createMockGroup({ name: 'Group 1' }),
        createMockGroup({ id: 'group-2', name: 'Group 2' }),
      ]

      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.findMany.mockResolvedValue(
        mockGroups.map((g) => ({
          ...g,
          course: null,
          assignedTeacher: null,
          members: [],
        })) as any
      )

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url)
      const params = createMockParams({ org: 'test-org' })

      const response = await GET(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.groups).toHaveLength(2)
      expect(data.groups[0].name).toBe('Group 1')
    })

    it('should filter groups by courseId when provided', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.findMany.mockResolvedValue([] as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups?courseId=course-1'
      const req = createMockRequest(url)
      const params = createMockParams({ org: 'test-org' })

      await GET(req, { params })

      expect(prismaMock.group.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            orgId: mockOrg.id,
            courseId: 'course-1',
          },
        })
      )
    })

    it('should return 401 when not authenticated', async () => {
      mockNoAuthSession()

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url)
      const params = createMockParams({ org: 'test-org' })

      const response = await GET(req, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 when organization not found', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(null)

      const url = 'http://localhost:3000/api/org/nonexistent/admin/groups'
      const req = createMockRequest(url)
      const params = createMockParams({ org: 'nonexistent' })

      const response = await GET(req, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Organization not found')
    })

    it('should return 403 when user is not an admin', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'student' }),
        ],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url)
      const params = createMockParams({ org: 'test-org' })

      const response = await GET(req, { params })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('You must be an admin in this organization')
    })
  })

  describe('POST - Create group', () => {
    it('should create a group successfully', async () => {
      const newGroupData = {
        name: 'New Group',
        description: 'Test description',
        courseId: null,
        assignedTeacherId: null,
        memberIds: [],
      }

      const createdGroup = createMockGroup(newGroupData)

      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.create.mockResolvedValue(createdGroup as any)
      prismaMock.group.findUnique.mockResolvedValue({
        ...createdGroup,
        course: null,
        assignedTeacher: null,
        members: [],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, { method: 'POST', body: newGroupData })
      const params = createMockParams({ org: 'test-org' })

      const response = await POST(req, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('Group created successfully')
      expect(data.group.name).toBe('New Group')
    })

    it('should return 400 when name is missing', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, { method: 'POST', body: {} })
      const params = createMockParams({ org: 'test-org' })

      const response = await POST(req, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Group name is required')
    })

    it('should create group with course and teacher', async () => {
      const mockCourse = createMockCourse()
      const mockTeacher = createMockUser({ id: 'teacher-1' })

      const newGroupData = {
        name: 'Course Group',
        description: 'Group for course',
        courseId: mockCourse.id,
        assignedTeacherId: mockTeacher.id,
        memberIds: ['student-1'],
      }

      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique
        .mockResolvedValueOnce({
          ...mockAdmin,
          memberships: [
            createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
          ],
        } as any)
        .mockResolvedValueOnce(mockTeacher as any)

      prismaMock.course.findFirst.mockResolvedValue(mockCourse as any)
      prismaMock.group.create.mockResolvedValue({
        id: 'group-1',
        ...newGroupData,
      } as any)
      prismaMock.groupMember.createMany.mockResolvedValue({ count: 1 } as any)
      prismaMock.group.findUnique.mockResolvedValue({
        id: 'group-1',
        ...newGroupData,
        course: mockCourse,
        assignedTeacher: mockTeacher,
        members: [
          {
            id: 'member-1',
            groupId: 'group-1',
            userId: 'student-1',
            user: createMockUser({ id: 'student-1' }),
          },
        ],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, { method: 'POST', body: newGroupData })
      const params = createMockParams({ org: 'test-org' })

      const response = await POST(req, { params })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.group.courseId).toBe(mockCourse.id)
      expect(data.group.assignedTeacherId).toBe(mockTeacher.id)
      expect(prismaMock.course.findFirst).toHaveBeenCalled()
      expect(prismaMock.groupMember.createMany).toHaveBeenCalled()
    })

    it('should return 404 when course not found', async () => {
      const newGroupData = {
        name: 'New Group',
        courseId: 'nonexistent-course',
      }

      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.course.findFirst.mockResolvedValue(null)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, { method: 'POST', body: newGroupData })
      const params = createMockParams({ org: 'test-org' })

      const response = await POST(req, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Course not found in this organization')
    })
  })

  describe('PUT - Update group', () => {
    it('should update group successfully', async () => {
      const updateData = {
        groupId: 'group-1',
        name: 'Updated Group',
        description: 'Updated description',
      }

      const existingGroup = createMockGroup({ id: 'group-1' })
      const updatedGroup = { ...existingGroup, ...updateData }

      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.findFirst.mockResolvedValue(existingGroup as any)
      prismaMock.group.update.mockResolvedValue(updatedGroup as any)
      prismaMock.group.findUnique.mockResolvedValue({
        ...updatedGroup,
        course: null,
        assignedTeacher: null,
        members: [],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, { method: 'PUT', body: updateData })
      const params = createMockParams({ org: 'test-org' })

      const response = await PUT(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Group updated successfully')
      expect(data.group.name).toBe('Updated Group')
    })

    it('should return 400 when groupId is missing', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, {
        method: 'PUT',
        body: { name: 'Updated' },
      })
      const params = createMockParams({ org: 'test-org' })

      const response = await PUT(req, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Group ID is required')
    })

    it('should return 404 when group not found', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.findFirst.mockResolvedValue(null)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, {
        method: 'PUT',
        body: { groupId: 'nonexistent', name: 'Updated' },
      })
      const params = createMockParams({ org: 'test-org' })

      const response = await PUT(req, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Group not found in this organization')
    })
  })

  describe('DELETE - Delete group', () => {
    it('should delete group successfully', async () => {
      const existingGroup = createMockGroup({ id: 'group-1' })

      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.findFirst.mockResolvedValue(existingGroup as any)
      prismaMock.group.delete.mockResolvedValue(existingGroup as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups?groupId=group-1'
      const req = createMockRequest(url, { method: 'DELETE' })
      const params = createMockParams({ org: 'test-org' })

      const response = await DELETE(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Group deleted successfully')
      expect(prismaMock.group.delete).toHaveBeenCalledWith({
        where: { id: 'group-1' },
      })
    })

    it('should return 400 when groupId is missing', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)

      const url = 'http://localhost:3000/api/org/test-org/admin/groups'
      const req = createMockRequest(url, { method: 'DELETE' })
      const params = createMockParams({ org: 'test-org' })

      const response = await DELETE(req, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Group ID is required')
    })

    it('should return 404 when group not found', async () => {
      mockAuthSession(mockSession)
      prismaMock.organization.findUnique.mockResolvedValue(mockOrg as any)
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockAdmin,
        memberships: [
          createMockMembership({ orgId: mockOrg.id, role: 'admin' }),
        ],
      } as any)
      prismaMock.group.findFirst.mockResolvedValue(null)

      const url =
        'http://localhost:3000/api/org/test-org/admin/groups?groupId=nonexistent'
      const req = createMockRequest(url, { method: 'DELETE' })
      const params = createMockParams({ org: 'test-org' })

      const response = await DELETE(req, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Group not found in this organization')
    })
  })
})
