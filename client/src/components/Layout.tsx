import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import logoImg from '../assets/logo.svg'
import { useUser } from '../authentication/useUser'

export default function Layout() {
    const navigate = useNavigate()
    const { user } = useUser()

    const handleEditProfile = () => {
        navigate('/profile/edit')
    }

    return (
        <>
            <img
                src={logoImg}
                alt="ChefGPT Logo"
                className="nav-logo-img-fixed"
            />
            <nav className="main-nav">
                <div className="nav-left">
                    <NavLink to="/" className="nav-link">
                        Home
                    </NavLink>
                    <ul className="nav-list">
                        {!user ? (
                            <>
                                <li>
                                    <NavLink to="/login" className="nav-link">
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/register"
                                        className="nav-link"
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink
                                        to="/recipe-generator"
                                        className="nav-link"
                                    >
                                        AI Chef
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/cookbook"
                                        className="nav-link"
                                    >
                                        My Cookbook
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/feed" className="nav-link">
                                        The Table
                                    </NavLink>
                                </li>
                                <li>
                                    <UserMenu
                                        onEditProfile={handleEditProfile}
                                        userName={user?.username}
                                    />
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    )
}
