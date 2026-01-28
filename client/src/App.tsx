import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Cookbook from './components/Cookbook.tsx'
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
import RecipeDetails from './components/RecipeDetails'
import RecipeEditPage from './components/RecipeEditPage.tsx'
import Dashboard from './components/Dashboard.tsx'
import ProtectedRoute from './authentication/ProtectedRoute'

// Simple placeholder components for pages not yet implemented

function EditProfile() {
    return <div>Edit Profile Page</div>
}
function Logout() {
    return <div>Logout Page</div>
}
function NotFound() {
    return <div>Page Not Found</div>
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="logout" element={<Logout />} />
                <Route element={<ProtectedRoute />}>
                    <Route index element={<Cookbook />} />
                    <Route path="cookbook" element={<Cookbook />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile/edit" element={<EditProfile />} />
                    <Route path="recipe/:id" element={<RecipeDetails />} />
                    <Route
                        path="recipe/edit/:id"
                        element={<RecipeEditPage />}
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}
