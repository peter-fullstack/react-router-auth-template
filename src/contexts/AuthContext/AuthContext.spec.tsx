import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSession } from '@/hooks'
import { AuthProvider } from '@/providers'
import { paths } from '@/router'
import { PublicClientApplication } from '@azure/msal-browser'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'

const mockNavigate = jest.fn()

jest.mock('@/services/api')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep all real exports
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/'
  })
}))

// Mock the MSAL instance with jest functions
const mockMsalInstance = {
  ssoSilent: jest.fn(),
  loginRedirect: jest.fn(),
  logoutRedirect: jest.fn(),
  getActiveAccount: jest.fn(),
  getAllAccounts: jest.fn()
  // Add other methods as needed
} as unknown as PublicClientApplication

// Mock the hooks
jest.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => children, // Simple passthrough for tests
  useMsal: () => ({ instance: mockMsalInstance }),
  useIsAuthenticated: () => false // or true, depending on test
}))

function SampleComponent() {
  const { signIn, signOut, authError } = useSession()

  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
      {authError && <p>{authError}</p>}

      <button onClick={signOut}>Sign out</button>
    </div>
  )
}

function customRender() {
  render(
    <MemoryRouter>
      <MsalProvider instance={mockMsalInstance}>
        <AuthProvider>
          <SampleComponent />
        </AuthProvider>
      </MsalProvider>
    </MemoryRouter>
  )
}

describe('AuthProvider', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when invoked', () => {
    it('should dispatch the msal functions in the correct order', async () => {
      ;(mockMsalInstance.ssoSilent as jest.Mock).mockRejectedValueOnce(
        new Error('Silent SSO failed')
      )

      customRender()

      const signInButton = screen.getByRole('button', { name: /Sign in/i })

      fireEvent.click(signInButton)

      await waitFor(
        () => {
          expect(mockMsalInstance.ssoSilent as jest.Mock).toHaveBeenCalledTimes(
            1
          )
          expect(
            mockMsalInstance.loginRedirect as jest.Mock
          ).toHaveBeenCalledTimes(1)
        },
        { timeout: 1000 }
      )
    })
  })

  describe('when invoked and there is an error', () => {
    it('should dispatch present a message for displaying to the user', async () => {
      ;(mockMsalInstance.ssoSilent as jest.Mock).mockRejectedValueOnce(
        new Error('Silent SSO failed')
      )
      ;(mockMsalInstance.loginRedirect as jest.Mock).mockRejectedValueOnce(
        new Error('Redirect failed')
      )

      customRender()

      const signInButton = screen.getByRole('button', {
        name: /Sign in/i
      })

      fireEvent.click(signInButton)

      await waitFor(
        () => {
          expect(mockMsalInstance.ssoSilent as jest.Mock).toHaveBeenCalledTimes(
            1
          )
          expect(
            mockMsalInstance.loginRedirect as jest.Mock
          ).toHaveBeenCalledTimes(1)
        },
        { timeout: 1000 }
      )

      expect(screen.getByText(/Authentication failed/)).toBeInTheDocument()
    })
  })

  describe('when the user clicks on the logout button', () => {
    it('should dispatch signOut function', async () => {
      customRender()

      const signOutButton = screen.getByRole('button', { name: /sign out/i })

      fireEvent.click(signOutButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith(paths.LOGIN_PATH)
      })
    })
  })
})
