import {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  updateUserMembership,
  deleteUser,
  formatRole,
  getRoleBadgeVariant,
  getStatusColor,
} from '@/lib/user-management'
import { createMockUser, createMockMembership } from '../utils/test-helpers'

// Mock global fetch
global.fetch = jest.fn()

describe('lib/user-management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchUsers', () => {
    it('should fetch users without parameters', async () => {
      const mockUsers = [createMockUser()]
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      })

      const result = await fetchUsers()

      expect(global.fetch).toHaveBeenCalledWith('/api/admin/users?')
      expect(result).toEqual(mockUsers)
    })

    it('should fetch users with filtering parameters', async () => {
      const mockUsers = [createMockUser()]
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      })

      await fetchUsers({
        role: 'admin',
        status: 'active',
        search: 'test',
        orgId: 'org-1',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/users?role=admin&status=active&search=test&orgId=org-1'
      )
    })

    it('should throw error when fetch fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      })

      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users')
    })
  })

  describe('fetchUser', () => {
    it('should fetch a single user by ID', async () => {
      const mockUser = createMockUser()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      })

      const result = await fetchUser('user-1')

      expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/user-1')
      expect(result).toEqual(mockUser)
    })

    it('should throw error when fetch fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      })

      await expect(fetchUser('user-1')).rejects.toThrow('Failed to fetch user')
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = createMockUser()
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'student',
        orgId: 'org-1',
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      })

      const result = await createUser(userData)

      expect(global.fetch).toHaveBeenCalledWith('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      expect(result).toEqual(mockUser)
    })

    it('should throw error when creation fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'User already exists' }),
      })

      const userData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'student',
        orgId: 'org-1',
      }

      await expect(createUser(userData)).rejects.toThrow('User already exists')
    })

    it('should throw generic error when no error message provided', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({}),
      })

      const userData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'student',
        orgId: 'org-1',
      }

      await expect(createUser(userData)).rejects.toThrow('Failed to create user')
    })
  })

  describe('updateUser', () => {
    it('should update user information', async () => {
      const mockUser = createMockUser({ name: 'Updated Name' })
      const updateData = {
        name: 'Updated Name',
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      })

      const result = await updateUser('user-1', updateData)

      expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/user-1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      expect(result).toEqual(mockUser)
    })

    it('should update email', async () => {
      const mockUser = createMockUser({ email: 'updated@example.com' })
      const updateData = {
        email: 'updated@example.com',
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      })

      const result = await updateUser('user-1', updateData)

      expect(result).toEqual(mockUser)
    })

    it('should throw error when update fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Email already in use' }),
      })

      await expect(updateUser('user-1', { email: 'existing@example.com' })).rejects.toThrow(
        'Email already in use'
      )
    })
  })

  describe('updateUserMembership', () => {
    it('should update user membership', async () => {
      const mockMembership = createMockMembership({
        role: 'admin',
      })
      const updateData = {
        orgId: 'org-1',
        role: 'admin' as const,
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMembership,
      })

      const result = await updateUserMembership('user-1', updateData)

      expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/user-1/membership', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      expect(result).toEqual(mockMembership)
    })

    it('should update membership status', async () => {
      const mockMembership = createMockMembership({
        status: 'suspended',
      })
      const updateData = {
        orgId: 'org-1',
        status: 'suspended' as const,
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMembership,
      })

      const result = await updateUserMembership('user-1', updateData)

      expect(result).toEqual(mockMembership)
    })

    it('should throw error when update fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Membership not found' }),
      })

      await expect(
        updateUserMembership('user-1', { orgId: 'org-1', role: 'admin' })
      ).rejects.toThrow('Membership not found')
    })
  })

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      })

      await deleteUser('user-1')

      expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/user-1', {
        method: 'DELETE',
      })
    })

    it('should throw error when deletion fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Cannot delete user with active enrollments' }),
      })

      await expect(deleteUser('user-1')).rejects.toThrow(
        'Cannot delete user with active enrollments'
      )
    })
  })

  describe('formatRole', () => {
    it('should capitalize role names', () => {
      expect(formatRole('admin')).toBe('Admin')
      expect(formatRole('teacher')).toBe('Teacher')
      expect(formatRole('student')).toBe('Student')
    })

    it('should handle already capitalized roles', () => {
      expect(formatRole('Admin')).toBe('Admin')
    })

    it('should handle empty strings', () => {
      expect(formatRole('')).toBe('')
    })
  })

  describe('getRoleBadgeVariant', () => {
    it('should return correct variant for admin', () => {
      expect(getRoleBadgeVariant('admin')).toBe('default')
      expect(getRoleBadgeVariant('Admin')).toBe('default')
    })

    it('should return correct variant for teacher', () => {
      expect(getRoleBadgeVariant('teacher')).toBe('secondary')
      expect(getRoleBadgeVariant('Teacher')).toBe('secondary')
    })

    it('should return correct variant for student', () => {
      expect(getRoleBadgeVariant('student')).toBe('outline')
      expect(getRoleBadgeVariant('Student')).toBe('outline')
    })

    it('should return outline for unknown roles', () => {
      expect(getRoleBadgeVariant('unknown')).toBe('outline')
      expect(getRoleBadgeVariant('')).toBe('outline')
    })
  })

  describe('getStatusColor', () => {
    it('should return correct color for active status', () => {
      expect(getStatusColor('active')).toBe('bg-green-500/10 text-green-500')
      expect(getStatusColor('Active')).toBe('bg-green-500/10 text-green-500')
    })

    it('should return correct color for suspended status', () => {
      expect(getStatusColor('suspended')).toBe('bg-red-500/10 text-red-500')
      expect(getStatusColor('Suspended')).toBe('bg-red-500/10 text-red-500')
    })

    it('should return correct color for invited status', () => {
      expect(getStatusColor('invited')).toBe('bg-yellow-500/10 text-yellow-500')
      expect(getStatusColor('Invited')).toBe('bg-yellow-500/10 text-yellow-500')
    })

    it('should return gray for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('bg-gray-500/10 text-gray-500')
      expect(getStatusColor('')).toBe('bg-gray-500/10 text-gray-500')
    })
  })
})
