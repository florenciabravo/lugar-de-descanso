import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { RandomProductProvider } from './context/RandomProductContext'
import { AuthProvider } from './context/AuthContext' //

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RandomProductProvider>
          <App />
        </RandomProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
