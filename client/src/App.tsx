import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Cookbook from './components/Cookbook.tsx'
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
import RecipeDetails from './components/RecipeDetails'
import RecipeEditPage from './components/RecipeEditPage.tsx'
import RecipeGenerator from './components/RecipeGenerator.tsx'
import ProtectedRoute from './authentication/ProtectedRoute'
import EditProfile from './components/EditProfile.tsx'
import HomePage from './components/HomePage.tsx'



function NotFound() {
    return <div>Page Not Found</div>
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="recipe-generator"
                        element={<RecipeGenerator />}
                    />

                    <Route path="cookbook" element={<Cookbook />} />
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
