import { useRoutePaths } from '@/hooks'
import { Link } from 'react-router-dom'
import { CanAccess } from '../CanAccess'

function NavBar() {
  const { LOGIN_PATH, METRICS_PATH, REGISTER_PATH, ROOT_PATH, USERS_PATH } =
    useRoutePaths()

  return (
    <div>
      <ul style={{ display: 'inline-flex', gap: 8, listStyle: 'none', padding: 0 }}>
        <li>
          <Link to={LOGIN_PATH}>Login</Link>
        </li>
        <li>
          <Link to={REGISTER_PATH}>Register</Link>
        </li>
        <li>
          <Link to={ROOT_PATH}>Home</Link>
        </li>

        <CanAccess permissions={['users.list']}>
          <li>
            <Link to={USERS_PATH}>Users</Link>
          </li>
        </CanAccess>

        <CanAccess permissions={['metrics.list']}>
          <li>
            <Link to={METRICS_PATH}>Metrics</Link>
          </li>
        </CanAccess>
      </ul>
    </div>
  )
}

export default NavBar
