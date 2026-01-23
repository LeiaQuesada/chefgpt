import { createContext } from 'react'
// Define the shape of the context value
export interface ThemeContextType {
    theme: string
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export default ThemeContext
