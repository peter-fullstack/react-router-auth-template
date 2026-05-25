import '@testing-library/jest-dom'

// Mock Vite environment variables for Jest
process.env.VITE_API_URL = 'http://localhost:3000'
process.env.MODE = 'test'

// Mock MSAL modules to prevent instantiation errors in tests
jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    handleRedirectPromise: jest.fn().mockResolvedValue(null),
    getAllAccounts: jest.fn().mockReturnValue([]),
    getActiveAccount: jest.fn().mockReturnValue(null),
    setActiveAccount: jest.fn(),
    loginRedirect: jest.fn().mockResolvedValue(undefined),
    logoutRedirect: jest.fn().mockResolvedValue(undefined),
    ssoSilent: jest.fn().mockResolvedValue(undefined),
    acquireTokenSilent: jest.fn().mockResolvedValue({
      accessToken: 'mock-token'
    })
  })),
  InteractionRequiredAuthError: class InteractionRequiredAuthError extends Error {
    errorCode = 'interaction_required'
  },
  EventType: {
    LOGIN_SUCCESS: 'msal:loginSuccess',
    LOGIN_FAILURE: 'msal:loginFailure',
    LOGOUT_SUCCESS: 'msal:logoutSuccess'
  }
}))

jest.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
  useMsal: jest.fn(() => ({
    instance: {
      initialize: jest.fn().mockResolvedValue(undefined),
      handleRedirectPromise: jest.fn().mockResolvedValue(null),
      getAllAccounts: jest.fn().mockReturnValue([]),
      getActiveAccount: jest.fn().mockReturnValue(null),
      setActiveAccount: jest.fn(),
      loginRedirect: jest.fn().mockResolvedValue(undefined),
      logoutRedirect: jest.fn().mockResolvedValue(undefined),
      ssoSilent: jest.fn().mockResolvedValue(undefined),
      acquireTokenSilent: jest.fn().mockResolvedValue({
        accessToken: 'mock-token'
      })
    },
    accounts: [],
    inProgress: 'none'
  })),
  useIsAuthenticated: jest.fn(() => false),
  AuthenticatedTemplate: ({ children }: { children: React.ReactNode }) => null,
  UnauthenticatedTemplate: ({ children }: { children: React.ReactNode }) => children
}))
