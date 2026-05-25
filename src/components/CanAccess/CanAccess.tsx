import { ReactNode } from 'react'
import { useSession } from '@/hooks'

type Props = {
  children: ReactNode
  permissions?: string[]
  roles?: string[]
}

function CanAccess(props: Props) {
  const { children } = props

  const { isAuthenticated } = useSession()
  // const { hasAllPermissions, hasAllRoles } = validateUserPermissions({
  //   user,
  //   permissions,
  //   roles
  // })

  // if (!isAuthenticated || !hasAllPermissions || !hasAllRoles) {
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default CanAccess
