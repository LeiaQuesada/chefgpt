import { useRef, useState, useEffect } from 'react'
import { logout as logoutApi } from '../authentication/auth-api'
import { useUser } from '../authentication/useUser'

interface UserMenuProps {
    onEditProfile: () => void
    userName?: string
}

const UserMenu: React.FC<UserMenuProps> = ({ onEditProfile, userName }) => {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const { refreshUser } = useUser()

    // Handles logout: calls backend and refreshes user context
    const handleLogout = async () => {
        await logoutApi()
        await refreshUser()
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                className="user-menu-btn"
                onClick={() => setOpen((o) => !o)}
            >
                {userName || 'User'}
                <span className="user-menu-icon"> ▾ </span>
            </button>
            {open && (
                <div className="user-menu-dropdown">
                    <button onClick={onEditProfile} className="user-menu-item">
                        Edit Profile
                    </button>
                    <button onClick={handleLogout} className="user-menu-item">
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserMenu
