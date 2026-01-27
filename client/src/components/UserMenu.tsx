import React, { useState, useRef, useEffect } from 'react'

interface UserMenuProps {
    onEditProfile: () => void
    onLogout: () => void
    userName?: string
}

const UserMenu: React.FC<UserMenuProps> = ({
    onEditProfile,
    onLogout,
    userName,
}) => {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

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
                <span role="img" aria-label="user" style={{ marginRight: 8 }}>
                    👤
                </span>
                {userName || 'User'}
                <span style={{ marginLeft: 6 }}>▼</span>
            </button>
            {open && (
                <div className="user-menu-dropdown">
                    <button onClick={onEditProfile} className="user-menu-item">
                        Edit Profile
                    </button>
                    <button onClick={onLogout} className="user-menu-item">
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserMenu
