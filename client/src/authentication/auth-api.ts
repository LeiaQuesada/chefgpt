import type { LoginCredentials, SignupData } from './auth-schemas'
import type { User } from './UserContext'

// this file handles API calls related to authentication. like to get current user info
// The file auth-api.ts defines and exports a function called getCurrentUser.
// This function is a mock (fake) API call for development.
// When called, it returns a Promise that resolves after a short delay with a hardcoded user object
// (with id, name, and email fields).
// This simulates fetching the currently authenticated user from a backend server,
//  allowing you to test authentication flows in your React app without needing a real backend

// these functions make HTTP requests to your backend API
// when app loads, UserProvider calls getCurrentUser to see who is logged in
// context is updated with this user info
// app now knows a user is logged in
// If no user is logged in, it would return null instead

// Get current user info (session)
export async function getCurrentUser(): Promise<User | null> {
    const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
    })
    if (res.status === 401 || res.status === 403) return null
    if (!res.ok) return null
    const data = await res.json()
    return { id: String(data.id), username: data.username }
}

// Login user
export async function login(credentials: LoginCredentials): Promise<boolean> {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.success === true
}

// Logout user
export async function logout(): Promise<boolean> {
    const res = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.success === true
}

// Signup user
export async function signup(signupData: SignupData): Promise<boolean> {
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.success === true
}
