import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from './context/ThemeProvider.js'
import UserProvider from './authentication/UserProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </UserProvider>
    </StrictMode>
)
