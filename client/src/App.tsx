// import "./App.css";
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout.tsx'

function App() {
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" />
                    <Route
                        path="/dashboard"
                        element={<div>Dashboard Page</div>}
                    />
                    {/* TODO set index route <Route index element={<Cookbook />} /> */}
                    <Route
                        path="/cookbook"
                        element={<div>Cookbook Page</div>}
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route
                        path="/register"
                        element={<div>Register Page</div>}
                    />
                    <Route
                        path="/profile/edit"
                        element={<div>Edit Profile Page</div>}
                    />
                    <Route
                        path="/recipe/:id"
                        element={<div>Recipe Details Page</div>}
                    />
                    <Route
                        path="/recipe/edit/:id"
                        element={<div>Edit Recipe Page</div>}
                    />
                    <Route
                        path="/recipe/new"
                        element={<div>New Recipe Page</div>}
                    />
                    <Route path="/logout" element={<div>Logout Page</div>} />
                    <Route path="*" />
                </Route>
            </Routes>
        </>
    )
}

export default App
