import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../authentication/auth-api'
import { useUser } from '../authentication/useUser'
import '../App.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [focus, setFocus] = useState<{ [k: string]: boolean }>({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { refreshUser } = useUser()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.')
            return
        }
        setLoading(true)
        try {
            const ok = await loginApi({ username, password })
            if (!ok) {
                setError('Invalid username or password.')
                setLoading(false)
                return
            }
            await refreshUser()
            navigate('/recipe-generator')
        } catch {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-panel">
                <div className="login-title">Welcome!</div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-col">
                        <div className="login-form-row">
                            <label
                                htmlFor="login-username"
                                className="login-label"
                            >
                                Username:
                            </label>
                            <input
                                id="login-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`login-input${focus.username ? ' login-input-focus' : ''}`}
                                onFocus={() =>
                                    setFocus((f) => ({ ...f, username: true }))
                                }
                                onBlur={() =>
                                    setFocus((f) => ({ ...f, username: false }))
                                }
                                required
                            />
                        </div>
                        <div className="login-form-row">
                            <label
                                htmlFor="login-password"
                                className="login-label"
                            >
                                Password:
                            </label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`login-input${focus.password ? ' login-input-focus' : ''}`}
                                onFocus={() =>
                                    setFocus((f) => ({ ...f, password: true }))
                                }
                                onBlur={() =>
                                    setFocus((f) => ({ ...f, password: false }))
                                }
                                required
                            />
                        </div>
                        {error && <div className="login-error">{error}</div>}
                    </div>
                    <div className="login-btn-col">
                        <button
                            type="submit"
                            className={`login-submit-btn${focus.login ? ' login-submit-focus' : ''}`}
                            onFocus={() =>
                                setFocus((f) => ({ ...f, login: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, login: false }))
                            }
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <Link to="/register" className="login-link">
                    Don’t have an account? Sign Up Here.
                </Link>
            </div>
        </div>
    )
}
