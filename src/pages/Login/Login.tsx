import { FormEvent, useEffect, useState } from 'react'
import { useSession } from '@/hooks'

function Login() {
  const [loginRequestStatus, setLoginRequestStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const { signIn } = useSession()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoginRequestStatus('loading')

    try {
      await signIn()
      setLoginRequestStatus('success')
    } catch (error) {
      setLoginRequestStatus('error')
    }
  }

  useEffect(() => {
    // clean the function to prevent memory leak
    return () => setLoginRequestStatus('success')
  }, [])

  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        <h2>Login</h2>

        <button type="submit" disabled={loginRequestStatus === 'loading'}>
          {loginRequestStatus === 'loading'
            ? 'Loading...'
            : 'Login with Microsoft'}
        </button>
      </form>
    </div>
  )
}

export default Login
