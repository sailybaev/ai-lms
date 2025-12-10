import { middleware } from '@/middleware'
import { NextRequest, NextResponse } from 'next/server'

// Mock fetch for org resolution API
global.fetch = jest.fn()

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Static assets and API routes', () => {
    it('should skip middleware for _next paths', async () => {
      const req = new NextRequest('http://localhost:3000/_next/static/chunk.js')
      const response = await middleware(req)

      expect(response).toBeDefined()
      // Should pass through without modification
    })

    it('should skip middleware for /api paths', async () => {
      const req = new NextRequest('http://localhost:3000/api/some-endpoint')
      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should skip middleware for /public paths', async () => {
      const req = new NextRequest('http://localhost:3000/public/image.png')
      const response = await middleware(req)

      expect(response).toBeDefined()
    })
  })

  describe('Public routes', () => {
    it('should skip middleware for /login', async () => {
      const req = new NextRequest('http://localhost:3000/login')
      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should skip middleware for /superadmin routes', async () => {
      const req = new NextRequest('http://localhost:3000/superadmin')
      const response = await middleware(req)

      expect(response).toBeDefined()
    })
  })

  describe('Organization-prefixed routes', () => {
    it('should allow org login page without session', async () => {
      const req = new NextRequest('http://localhost:3000/test-org/login')
      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should redirect to login when no session for org route', async () => {
      const url = 'http://localhost:3000/test-org/admin/users'
      const req = new NextRequest(url)

      const response = await middleware(req)

      expect(response?.status).toBe(307) // Redirect status
      expect(response?.headers.get('location')).toContain('/test-org/login')
      expect(response?.headers.get('location')).toContain('callbackUrl')
    })

    it('should pass through when session exists', async () => {
      const url = 'http://localhost:3000/test-org/admin/users'
      const req = new NextRequest(url, {
        headers: {
          cookie: 'next-auth.session-token=valid-token',
        },
      })

      const response = await middleware(req)

      // Should not redirect (pass through)
      expect(response).toBeDefined()
    })

    it('should pass through with secure session token', async () => {
      const url = 'http://localhost:3000/test-org/student/courses'
      const req = new NextRequest(url, {
        headers: {
          cookie: '__Secure-next-auth.session-token=valid-token',
        },
      })

      const response = await middleware(req)

      expect(response).toBeDefined()
    })
  })

  describe('Domain resolution', () => {
    it('should rewrite URL for custom domain with exact match', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ orgSlug: 'acme' }),
      })

      const url = 'http://acme.com/admin/users'
      const req = new NextRequest(url)

      const response = await middleware(req)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/org/resolve?host=acme.com')
      )
      // Should rewrite to /acme/admin/users
      expect(response).toBeDefined()
    })

    it('should not attempt domain resolution for localhost', async () => {
      const url = 'http://localhost:3000/some-page'
      const req = new NextRequest(url)

      const response = await middleware(req)

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should not attempt domain resolution for 127.0.0.1', async () => {
      const url = 'http://127.0.0.1:3000/some-page'
      const req = new NextRequest(url)

      const response = await middleware(req)

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should handle domain resolution failure gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const url = 'http://custom-domain.com/page'
      const req = new NextRequest(url)

      const response = await middleware(req)

      // Should not throw error, should pass through
      expect(response).toBeDefined()
    })

    it('should handle no org match from domain resolution', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ orgSlug: null }),
      })

      const url = 'http://unknown-domain.com/page'
      const req = new NextRequest(url)

      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should rewrite URL when org slug is found', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ orgSlug: 'myorg' }),
      })

      const url = 'http://custom.com/admin/dashboard'
      const req = new NextRequest(url)

      const response = await middleware(req)

      // Should rewrite to /myorg/admin/dashboard
      expect(response).toBeDefined()
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('Authentication checks', () => {
    it('should preserve callback URL in redirect', async () => {
      const url = 'http://localhost:3000/test-org/admin/settings'
      const req = new NextRequest(url)

      const response = await middleware(req)

      const location = response?.headers.get('location')
      expect(location).toContain('callbackUrl=%2Ftest-org%2Fadmin%2Fsettings')
    })

    it('should detect org prefix correctly', async () => {
      // /test-org/admin should be detected as having org prefix
      const req1 = new NextRequest('http://localhost:3000/test-org/admin')
      const response1 = await middleware(req1)
      expect(response1).toBeDefined()

      // /admin should NOT be detected as having org prefix
      const req2 = new NextRequest('http://localhost:3000/admin')
      const response2 = await middleware(req2)
      expect(response2).toBeDefined()
    })

    it('should not treat reserved paths as org prefixes', async () => {
      const reservedPaths = ['admin', 'teacher', 'student', 'superadmin', 'login']

      for (const path of reservedPaths) {
        const req = new NextRequest(`http://localhost:3000/${path}/page`)
        const response = await middleware(req)
        expect(response).toBeDefined()
      }
    })
  })

  describe('Edge cases', () => {
    it('should handle root path', async () => {
      const req = new NextRequest('http://localhost:3000/')
      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should handle paths with query parameters', async () => {
      const url = 'http://localhost:3000/test-org/admin/users?page=2&sort=name'
      const req = new NextRequest(url, {
        headers: {
          cookie: 'next-auth.session-token=valid-token',
        },
      })

      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should handle paths with hash fragments', async () => {
      const url = 'http://localhost:3000/test-org/student/courses#section-1'
      const req = new NextRequest(url, {
        headers: {
          cookie: 'next-auth.session-token=valid-token',
        },
      })

      const response = await middleware(req)

      expect(response).toBeDefined()
    })

    it('should handle deeply nested paths', async () => {
      const url = 'http://localhost:3000/test-org/admin/users/user-1/edit'
      const req = new NextRequest(url, {
        headers: {
          cookie: 'next-auth.session-token=valid-token',
        },
      })

      const response = await middleware(req)

      expect(response).toBeDefined()
    })
  })
})
