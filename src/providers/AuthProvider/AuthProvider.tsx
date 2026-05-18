import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext, User } from '@/contexts'
import { paths } from '@/router'

import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { AuthenticationResult } from '@azure/msal-browser'

type Props = {
  children: ReactNode
}

function AuthProvider(props: Props) {
  const { children } = props

  const [user, setUser] = useState<User>()
  const [loadingUserData, setLoadingUserData] = useState(false)
  const navigate = useNavigate()

  // Update to use MSAL for authentication state
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  async function signIn() {
    let response: AuthenticationResult | null = null

    try {
      try {
        setLoadingUserData(true)

        response = await instance.ssoSilent({
          scopes: ['User.Read']
        })
      } catch (error: any) {
        setLoadingUserData(false)

        await instance.loginRedirect({
          scopes: ['User.Read']
        })
      }

      if (response?.account) {
        instance.setActiveAccount(response.account)
        setUser({
          email: response.account?.username,
          permissions: [], // Permissions would need to be fetched separately
          roles: [] // Roles would need to be fetched separately
        })
      }
    } catch (error) {
      // TODO - something more robust than alerting the user in production code
    }
    setLoadingUserData(false)
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
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
