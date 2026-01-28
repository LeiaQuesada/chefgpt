import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

const Register: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [fileName, setFileName] = useState('')
    const [error, setError] = useState('')
    const [focus, setFocus] = useState<{ [k: string]: boolean }>({})
    const navigate = useNavigate()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name)
        } else {
            setFileName('')
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setError('')
        if (!username.trim() || !password.trim() || !confirm.trim()) {
            setError('Username, password, and confirm password are required.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        // TODO: Call POST /api/users with form data
        console.log({ username, password, fileName })
        navigate('/login')
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-title">Create Account</div>
                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div>
                        <label
                            htmlFor="register-username"
                            className="register-label"
                        >
                            Username
                        </label>
                        <input
                            id="register-username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`register-input${focus.username ? ' register-input-focus' : ''}`}
                            onFocus={() =>
                                setFocus((f) => ({ ...f, username: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, username: false }))
                            }
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="register-password"
                            className="register-label"
                        >
                            Password
                        </label>
                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`register-input${focus.password ? ' register-input-focus' : ''}`}
                            onFocus={() =>
                                setFocus((f) => ({ ...f, password: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, password: false }))
                            }
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="register-confirm"
                            className="register-label"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="register-confirm"
                            name="confirm"
                            type="password"
                            autoComplete="new-password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className={`register-input${focus.confirm ? ' register-input-focus' : ''}`}
                            onFocus={() =>
                                setFocus((f) => ({ ...f, confirm: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, confirm: false }))
                            }
                            required
                        />
                    </div>
                    <div className="register-file-row">
                        <label
                            htmlFor="register-file"
                            className="register-label"
                            style={{ marginBottom: 0 }}
                        >
                            Profile picture (optional)
                        </label>
                        <input
                            id="register-file"
                            name="profilePic"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className={`register-file-btn${focus.file ? ' register-file-btn-focus' : ''}`}
                            onClick={() =>
                                document
                                    .getElementById('register-file')
                                    ?.click()
                            }
                            onFocus={() =>
                                setFocus((f) => ({ ...f, file: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, file: false }))
                            }
                            aria-label="Upload profile picture"
                        >
                            Upload image
                        </button>
                        {fileName && (
                            <span className="register-file-name">
                                {fileName}
                            </span>
                        )}
                    </div>
                    {error && <div className="register-error">{error}</div>}
                    <div className="register-actions">
                        <button
                            type="submit"
                            className={`register-submit${focus.submit ? ' register-submit-focus' : ''}`}
                            onFocus={() =>
                                setFocus((f) => ({ ...f, submit: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, submit: false }))
                            }
                        >
                            Create Account
                        </button>
                    </div>
                </form>
                <div className="register-secondary">
                    Already have an account?
                    <Link to="/login" className="register-link">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register
