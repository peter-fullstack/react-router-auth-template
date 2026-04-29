import { BrowserRouter } from 'react-router-dom'
import { NavBar } from './components'
import { AuthProvider } from './providers'
import { Router } from './router'
import './App.css'
import { Header } from './components/Header/Header'
import { LoginStatus } from './components/LoginStatus/LoginStatus'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="page-container">
          <Header />
          <div className="main-content-container">
            <div></div>
            <div>
              <NavBar />
              <LoginStatus />
              <Router />
            </div>
            <div></div>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
