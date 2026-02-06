import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface UserProfile {
    id: number
    username: string
    image_url?: string | null
}

export default function EditProfile() {
    const [username, setUsername] = useState('')
    const [originalUsername, setOriginalUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to load profile')
                return res.json()
            })
            .then((data: UserProfile) => {
                setUsername(data.username)
                setOriginalUsername(data.username)
            })
            .catch(() => setError('Could not load profile'))
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        if (!username.trim()) {
            setError('Username is required')
            return
        }
        if (newPassword && newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password: newPassword || undefined,
                }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.detail || 'Failed to update profile')
            }
            setSuccess(true)
            setNewPassword('')
            setConfirmPassword('')
            navigate('/')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    // Disable save if no changes or only confirmPassword is filled
    const noChanges =
        username === originalUsername &&
        newPassword === '' &&
        confirmPassword === ''
    const onlyConfirmFilled =
        username === originalUsername &&
        newPassword === '' &&
        confirmPassword !== ''

    return (
        <div
            className="register-card"
            style={{ maxWidth: 400, margin: '40px auto' }}
        >
            <h2 className="register-title">Edit Profile</h2>
            <form className="register-form" onSubmit={handleSave}>
                <div className="register-form-row">
                    <label className="register-label" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="register-input"
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="register-form-row">
                    <label className="register-label" htmlFor="newPassword">
                        New Password
                    </label>
                    <input
                        className="register-input"
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        autoComplete="new-password"
                    />
                </div>
                <div className="register-form-row">
                    <label className="register-label" htmlFor="confirmPassword">
                        Confirm New Password
                    </label>
                    <input
                        className="register-input"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        autoComplete="new-password"
                    />
                </div>
                {error && <div className="register-error">{error}</div>}
                {success && (
                    <div className="register-secondary">
                        Profile updated successfully!
                    </div>
                )}
                <div className="edit-profile-btn-row">
                    <button
                        type="submit"
                        className="edit-profile-save-btn"
                        disabled={loading || noChanges || onlyConfirmFilled}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        className="edit-profile-cancel-btn"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
