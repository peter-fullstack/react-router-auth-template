import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthContext } from '@/contexts'
import Login from './Login'

const providerUserUnloggedMock = {
  user: undefined,
  isAuthenticated: false,
  loadingUserData: false,
  signIn: jest.fn(),
  signOut: jest.fn()
}

describe('Login page component', () => {
  beforeEach(() => {
    render(
      <AuthContext.Provider value={providerUserUnloggedMock}>
        <Login />
      </AuthContext.Provider>
    )
  })


  it('should disabled button when submit form', async () => {
    const button = screen.getByRole('button', {
      name: /Login with Microsoft/i
    }) as HTMLButtonElement

    expect(button).not.toHaveAttribute('disabled')
    expect(button).toHaveTextContent(/Login with Microsoft/)

    fireEvent.click(button)

    await waitFor(
      () => {
        expect(button).toHaveAttribute('disabled')
        expect(button).toHaveTextContent(/Loading/)
      },
      { timeout: 1000 }
    )
  })
})
