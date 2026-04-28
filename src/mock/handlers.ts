// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const handlers = [
  // Login endpoint
  http.post(`${baseURL}/sessions`, async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string
      password: string
    }

    // Mock user data
    const users = {
      'admin@site.com': {
        email: 'admin@site.com',
        permissions: ['users.list', 'users.create', 'metrics.list'],
        roles: ['administrator']
      },
      'client@site.com': {
        email: 'client@site.com',
        permissions: ['metrics.list'],
        roles: ['client']
      }
    }

    const user = users[email as keyof typeof users]

    if (user && password === 'password@123') {
      return HttpResponse.json({
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        permissions: user.permissions,
        roles: user.roles
      })
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Get user data endpoint
  http.get(`${baseURL}/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Mock returning admin user by default
    return HttpResponse.json({
      email: 'admin@site.com',
      permissions: ['users.list', 'users.create', 'metrics.list'],
      roles: ['administrator']
    })
  }),

  // Refresh token endpoint
  http.post(`${baseURL}/refresh`, async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string }

    if (refreshToken) {
      return HttpResponse.json({
        token: 'mock-jwt-token-refreshed-' + Date.now(),
        refreshToken: 'mock-refresh-token-refreshed-' + Date.now()
      })
    }

    return HttpResponse.json(
      { code: 'token.expired', message: 'Invalid refresh token' },
      { status: 401 }
    )
  }),

  http.get(`${baseURL}/users`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Mock returning admin user by default
    return HttpResponse.json([
      {
        email: 'admin@site.com',
        permissions: ['users.list', 'users.create', 'metrics.list'],
        roles: ['administrator']
      },
      {
        email: 'client@site.com',
        permissions: ['metrics.list'],
        roles: ['client']
      }
    ])
  })
]
