import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { RandomProductProvider } from './context/RandomProductContext'
import { AuthProvider } from './context/AuthContext'
import { FavoriteProvider } from './context/FavoriteContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <RandomProductProvider>
            <FavoriteProvider>
              <App />
            </FavoriteProvider>
          </RandomProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
