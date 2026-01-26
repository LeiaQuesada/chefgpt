import { createContext } from 'react'

export type User = {
    id: string
    username: string
}

type UserContextType = {
    user: User | null
    isLoading: boolean
    refreshUser: () => Promise<void>
}
// telling react the shape of our context value. any provider must provide these fields.
// it will contain user info (who is logged in), loading state, and a function to refresh user data and recheck login

// this creates the global context object
const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    refreshUser: async () => {},
})
// default values for the context
// this default is used only if a component uses the context without being wrapped in a provider
// usually not the case, so these defaults are mostly placeholders
// the real values come from UserProvider.tsx
// refreshUser is a no-op function by default which does nothing

// we export this context object so other components can import and use it
export default UserContext

// this file defines what kind of data the UserContext will hold
// it defines the box: what data exists, what functions are available
// UserProvider.tsx puts data in the box
// other components can use the box by importing UserContext
// later use const { user } = useContext(UserContext)
// to access the current logged in user without passing props down manually
