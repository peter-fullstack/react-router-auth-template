import ReactDOM from 'react-dom/client'
import App from './App'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from '@/authConfig'

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mock/browser')

    return worker.start({
      onUnhandledRequest: 'bypass' // Don't warn about unhandled requests
    })
  }
}

async function initializeMsal() {
  // Handle redirect promise to complete authentication flow
  await msalInstance.initialize()
  const response = await msalInstance.handleRedirectPromise()
  
  if (response) {
    // Set the active account after successful redirect
    msalInstance.setActiveAccount(response.account)
  } else {
    // If no redirect response, try to set active account from cache
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0])
    }
  }
}

Promise.all([enableMocking(), initializeMsal()]).then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  )
})
