import { useState } from 'react'
// ...existing code...
// import the context object we created earlier

// ThemeProvider holds the global theme state

import type { ReactNode } from 'react'
import ThemeContext from './ThemeContext'

interface ThemeProviderProps {
    children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    // themeprovider is a wrapper component.
    // {children} means whatever is wrapped inside <themeprovider> becomes children
    const [theme, setTheme] = useState('light')
    //  used to store the current theme. theme starts as light

    // create toggle theme function to swittch between light and dark
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }
    //   takes previous theme. if its light, switch to dark. if its dark, switch to light

    // make theme and toggleTheme available to all descendant components.
    // basically shares state with children
    // {children} allows wrapped components to render
    //   everything inside <themeprovider> can access the theme. no props needed
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
