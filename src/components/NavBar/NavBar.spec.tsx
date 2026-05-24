import { fireEvent, render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '@/contexts'
import { paths } from '@/router'
import NavBar from './NavBar'

const providerUserLoggedOutMock = {
  signIn: jest.fn(),
  signOut: jest.fn(),
  user: undefined,
  isAuthenticated: false,
  loadingUserData: false,
  authError: ''
}

const providerUserLoggedInMock = {
  signIn: jest.fn(),
  signOut: jest.fn(),
  user: {
    email: 'email@site.com',
    permissions: ['users.list', 'metrics.list'],
    roles: []
  },
  isAuthenticated: true,
  loadingUserData: false,
  authError: ''
}

type WrapperProps = {
  children: ReactNode
}

function wrapper(props: WrapperProps) {
  const { children } = props

  return <MemoryRouter>{children}</MemoryRouter>
}

describe('NavBar component', () => {
  it('should render with Login link', () => {
    render(
      <AuthContext.Provider value={providerUserLoggedOutMock}>
        <NavBar />
      </AuthContext.Provider>,
      { wrapper }
    )

    expect(screen.getByText(/Login/)).toHaveAttribute('href', paths.LOGIN_PATH)
    expect(screen.queryByText(/Users/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Metrics/)).not.toBeInTheDocument()
  })

  describe('when the user is authenticated', () => {
    it('should show Users and Metrics menu links', () => {
      render(
        <AuthContext.Provider value={providerUserLoggedInMock}>
          <NavBar />
        </AuthContext.Provider>,
        { wrapper }
      )

      expect(screen.getByText(/Users/)).toBeInTheDocument()
      expect(screen.getByText(/Metrics/)).toBeInTheDocument()
    })
  })

  describe('when the user clicks on the logout button', () => {
    it('should logout user', () => {
      render(
        <AuthContext.Provider value={providerUserLoggedInMock}>
          <NavBar />
        </AuthContext.Provider>,
        { wrapper }
      )

      const logoutButton = screen.getByRole('button', { name: /logout/i })

      fireEvent.click(logoutButton)

      expect (providerUserLoggedInMock.signOut).toHaveBeenCalledTimes(1)
    })
  })
})
