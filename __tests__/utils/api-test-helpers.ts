import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
  } = {}
): NextRequest {
  const { method = 'GET', body, headers = {} } = options

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    requestInit.body = JSON.stringify(body)
  }

  return new NextRequest(url, requestInit)
}

/**
 * Create mock params for API routes that use dynamic segments
 */
export function createMockParams(params: Record<string, string>) {
  return Promise.resolve(params)
}

/**
 * Mock authenticated session for tests
 */
export function mockAuthSession(session: any) {
  ;(getServerSession as jest.Mock).mockResolvedValue(session)
}

/**
 * Mock no session (unauthenticated)
 */
export function mockNoAuthSession() {
  ;(getServerSession as jest.Mock).mockResolvedValue(null)
}

/**
 * Extract JSON from Response
 */
export async function getJsonResponse(response: Response) {
  return response.json()
}
