import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NavigationProvider } from './context/NavigationContext'
import React from 'react'

// Import your Publishable Key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key")
// }

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <NavigationProvider>
          <AppContextProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AppContextProvider>
        </NavigationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
