import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import cookingImg from '../assets/cooking.png'
import UserMenu from './UserMenu'
import { useUser } from '../authentication/useUser'

export default function Layout() {
    const navigate = useNavigate()
    const { user } = useUser()

    const handleEditProfile = () => {
        navigate('/profile/edit')
    }
    const handleLogout = () => {
        navigate('/logout')
    }

    return (
        <div>
            <nav className="main-nav">
                <div className="nav-left">
                    <span className="logo-chefgpt">
                        ChefGPT
                        <img
                            src={cookingImg}
                            alt="cooking"
                            className="logo-img"
                        />
                    </span>
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                </div>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" className="nav-link">
                            Register
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className="nav-link">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cookbook" className="nav-link">
                            Cookbook
                        </NavLink>
                    </li>
                    <li>
                        <UserMenu
                            onEditProfile={handleEditProfile}
                            onLogout={handleLogout}
                            userName={user?.username}
                        />
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    )
}
