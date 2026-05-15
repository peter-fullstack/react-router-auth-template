import React, { FormEvent, useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AuthenticationResult } from '@azure/msal-browser';

function initialFormValues() {
  return {
    email: '',
    password: ''
  }
}

function Login() {
  const [values, setValues] = useState(initialFormValues);
  const [loginRequestStatus, setLoginRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState('')
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const account = instance.getActiveAccount()

  const users = [
    { name: 'Admin', email: 'admin@site.com', password: 'password@123' },
    { name: 'Client', email: 'client@site.com', password: 'password@123' }
  ]

  function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const user = event.target.value
    setValues(JSON.parse(user))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setValues({
      ...values,
      [name]: value
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setLoginRequestStatus('loading');
    var response: AuthenticationResult | null = null;

    try {
      try {
        response = await instance.ssoSilent({
          scopes: ['User.Read']
        });
      } catch (error: any) {
        console.log('Trying redirect login...')
        //alert(`Login failed. Please try again. ${error.message}`)
        
        await instance.loginRedirect({
          scopes: ['User.Read']
        });
      }

      if (response && response.account) {
        console.log(response.account)
        instance.setActiveAccount(response.account)
        setIsLoggedIn(true)
        setUserDisplayName(response.account.name || 'UNKNOWN USER')
      } else {
        setIsLoggedIn(false)
      }
    } catch (error: any) {
      setIsLoggedIn(false)
      alert(`Login failed. Please try again. ${error.message}`)
    }
  }

  useEffect(() => {
    // clean the function to prevent memory leak
    return () => setLoginRequestStatus('success')
  }, [])

  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        <select
          name="select-user"
          onChange={handleUserChange}
          style={{ margin: 5 }}
        >
          <option value="" style={{ display: 'none' }}>
            Select an user to test
          </option>
          {users.map((user) => (
            <option key={user.email} value={JSON.stringify(user)}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="login-form-container">
          <label htmlFor="email">Email</label>
          <input
            value={values.email}
            type="email"
            name="email"
            id="email"
            disabled={loginRequestStatus === 'loading'}
            onChange={handleChange}
          />
        </div>

        <div className="login-form-container">
          <label htmlFor="password">Password</label>
          <input
            value={values.password}
            type="password"
            name="password"
            id="password"
            disabled={loginRequestStatus === 'loading'}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loginRequestStatus === 'loading'}>
          {loginRequestStatus === 'loading' ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default Login
