import { useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
// children can be anything React can render. Buttons, divs, pages, routes — all valid.
import UserContext from './UserContext'
// imports the context object we created earlier in UserContext.ts
import type { User } from './UserContext'
// imports shape of User from UserContext file
import { getCurrentUser } from './auth-api'
// imports function to ask backend who is logged in right now

// This creates a component called UserProvider. so we use it like this later
// <UserProvider>
//   <App />
// </UserProvider>
export default function UserProvider({ children }: { children: ReactNode }) {
    // user holds the current user's info, or null if not logged in.
    const [user, setUser] = useState<User | null>(null)
    // isLoading tracks whether we're currently checking authentication status
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const refreshUser = useCallback(async () => {
        setIsLoading(true)
        const user = await getCurrentUser()
        setUser(user)
        setIsLoading(false)
    }, [])
    // this function asks backend who is logged in right now
    // updates user state with the result
    // sets loading state while the request is in progress

    // when app first loads, check who is logged in
    useEffect(() => {
        refreshUser()
    }, [refreshUser])
    // calls refreshUser once when component mounts to check login status
    // dependency array with refreshUser ensures effect runs only once

    return (
        <UserContext.Provider value={{ user, isLoading, refreshUser }}>
            {children}
        </UserContext.Provider>
    )
    // this puts data into the UserContext box we created earlier
    // makes user, isLoading, and refreshUser available to all descendant components.
    // {children} allows wrapped components to render
    // everything inside <UserProvider> can access user info without props
}

// UserProvider’s job is to ask the backend who is logged in and store the answer for the whole app.
