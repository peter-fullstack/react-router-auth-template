import { useSession } from '@/hooks'

export function LoginStatus() {
  const { isAuthenticated, user, signOut } = useSession()

  return (
    <>
      {isAuthenticated && (
        <>
          <span style={{ marginRight: 4 }}>{user?.email}</span>
          <button onClick={signOut}>Logout</button>
        </>
      )}

      {!isAuthenticated && (
        <>
          <span style={{ marginRight: 4 }}>Not logged in</span>
        </>
      )}
    </>
  )
}
