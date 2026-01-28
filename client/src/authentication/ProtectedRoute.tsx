import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './useUser'

export default function ProtectedRoute() {
    const { user, isLoading } = useUser()

    if (isLoading) {
        // Optionally, show a loading spinner or placeholder
        return <div>Loading...</div>
    }
    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />
    }
    // User is authenticated, render the child route
    return <Outlet />
}
