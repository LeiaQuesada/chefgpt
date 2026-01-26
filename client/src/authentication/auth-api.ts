import type { User } from './UserContext'

// Minimal mock for development
export async function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: '1', username: 'Test User' })
        }, 500)
    })
}
// this file handles API calls related to authentication. like to get current user info
// The file auth-api.ts defines and exports a function called getCurrentUser.
// This function is a mock (fake) API call for development.
// When called, it returns a Promise that resolves after a short delay with a hardcoded user object
// (with id, name, and email fields).
// This simulates fetching the currently authenticated user from a backend server,
//  allowing you to test authentication flows in your React app without needing a real backend

// In a real app, these functions would make HTTP requests to your backend API
// Can later add login() / logout() functions here
// when app loads, UserProvider calls getCurrentUser to see who is logged in
// after 500ms, it returns a mock user object
// context is updated with this user info
// app now knows a user is logged in
// If no user is logged in, it would return null instead
