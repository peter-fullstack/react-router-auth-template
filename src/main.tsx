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

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  )
})
