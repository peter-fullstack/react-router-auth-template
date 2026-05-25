import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext, User } from '@/contexts'
import { paths } from '@/router'

import { useMsal, useIsAuthenticated } from '@azure/msal-react'

type Props = {
  children: ReactNode
}

function AuthProvider(props: Props) {
  const { children } = props

  const [user, setUser] = useState<User>()
  const [loadingUserData, setLoadingUserData] = useState(false)
  const [authError, setAuthError] = useState('')
  const navigate = useNavigate()

  // Update to use MSAL for authentication state
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  async function signIn() {
    try {
      try {
        // Try silent SSO first
        setLoadingUserData(true)
        await instance.ssoSilent({
          scopes: ['User.Read']
        })
        // If successful, user is already authenticated
        // The active account is already set by main.tsx initialization
      } catch (error) {
        // Silent SSO failed, redirect to Microsoft login
        // Note: This will navigate away from the page
        // The redirect response is handled in main.tsx
        await instance.loginRedirect({
          scopes: ['User.Read']
        })
      }
    } catch (error) {
      setUser(undefined)
      setAuthError('Authentication failed')
    } finally {
      setLoadingUserData(false)
    }
  }

  async function signOut() {
    setUser(undefined)
    setLoadingUserData(false)
    const activeAccount = instance.getActiveAccount()

    try {
      await instance.logoutRedirect({
        account: activeAccount,
        postLogoutRedirectUri: window.location.origin + paths.LOGIN_PATH
      })
    } catch (error) {
      // Todo: Handle logout error if needed
    }

    navigate(paths.LOGIN_PATH)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loadingUserData,
        signIn,
        signOut,
        authError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
