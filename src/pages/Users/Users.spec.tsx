import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { api } from '@/services/api'
import { AuthProvider } from '@/providers'
import Users from './Users'

jest.mock('@/services/api')

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
)

describe('Users page component', () => {
  describe('when the request returns valid data', () => {
    it('should render a list of users', async () => {
      const responseMock = {
        data: [
          {
            id: 1,
            name: 'User 1',
            email: 'user1@site.com',
            permissions: ['read'],
            roles: ['user']
          },
          {
            id: 2,
            name: 'User 2',
            email: 'user2@site.com',
            permissions: ['read', 'write'],
            roles: ['admin']
          }
        ]
      }

      ;(api.get as jest.Mock).mockReturnValueOnce(responseMock)

      render(<Users />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByText(/User 1/)).toBeInTheDocument()
          expect(screen.getByText(/User 2/)).toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  })

  describe('when the request does not return the payload', () => {
    it('should render empty list message', async () => {
      ;(api.get as jest.Mock).mockReturnValueOnce({ data: {} })

      render(<Users />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByText(/empty user list/)).toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  })

  describe('when the request does not return the data attribute', () => {
    it('should render empty list message', async () => {
      ;(api.get as jest.Mock).mockRejectedValueOnce({})

      render(<Users />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByText(/empty user list/)).toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  })
})
