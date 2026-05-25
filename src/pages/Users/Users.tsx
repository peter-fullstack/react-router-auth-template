import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { api } from '@/services'

type User = {
  id: number
  name: string
  email: string
  permissions: string[]
  roles: string[]
}

function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get('/users')
        const users = response?.data || []
        setUsers(users)
      } catch (error) {
        const err = error as AxiosError
        return err
      }
    }

    loadUsers()
  }, [])

  return (
    <div>
      <h1>Users</h1>

      <ul style={{ listStyle: 'none', padding: 0, margin: '3rem' }}>
        {users?.length > 0 ? (
          users.map((user) => (
            <li key={user.email}>
              <strong>Name:</strong> {user.name} <strong>Email:</strong>{' '}
              {user.email} <strong>Permissions:</strong>{' '}
              {user?.permissions.map((permission) => permission).join(', ')}{' '}
              <strong>Roles:</strong>{' '}
              {user?.roles.map((role) => role).join(', ')}
            </li>
          ))
        ) : (
          <li>empty user list</li>
        )}
      </ul>
    </div>
  )
}

export default Users
