import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Cookbook from './components/Cookbook.tsx'
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
import RecipeDetails from './components/RecipeDetails'
import RecipeEditPage from './components/RecipeEditPage.tsx'

// Simple placeholder components for pages not yet implemented
function Dashboard() {
    return <div>Dashboard Page</div>
}
function EditProfile() {
    return <div>Edit Profile Page</div>
}
// function EditRecipe() {
//     return <div>Edit Recipe Page</div>
// }
function Logout() {
    return <div>Logout Page</div>
}
function NotFound() {
    return <div>Page Not Found</div>
}

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Cookbook />} />
                <Route path="cookbook" element={<Cookbook />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="logout" element={<Logout />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="recipe/:id" element={<RecipeDetails />} />
                <Route path="recipe/edit/:id" element={<RecipeEditPage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default App
