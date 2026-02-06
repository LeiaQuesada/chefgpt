import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../authentication/auth-api'
import type { SignupData } from '../authentication/auth-schemas'
import '../App.css'

const Register: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [error, setError] = useState('')
    const [focus, setFocus] = useState<{ [k: string]: boolean }>({})
    const navigate = useNavigate()

    /**
     * Handles the registration form submission.
     * Validates input, then calls the signup API to register the user.
     * On success, navigates to login page. On error, displays error message.
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        // Basic validation for required fields
        if (!username.trim() || !password.trim() || !confirm.trim()) {
            setError('Username, password, and confirm password are required.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        // Prepare the signup data object for the API
        const signupData: SignupData = {
            username,
            password,
            // The backend expects image_url, but file upload is not implemented yet
            image_url: '',
        }
        // Call the signup API (frontend -> backend)
        const success = await signup(signupData)
        if (success) {
            // On successful signup, redirect to login page
            navigate('/login')
        } else {
            // Show error if signup failed (e.g., username taken)
            setError('Registration failed. Username may already exist.')
        }
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
                            Username:
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
                            Password:
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
                            Confirm Password:
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

                    {error && <div className="register-error">{error}</div>}
                    <div className="register-btn-col">
                        <button
                            type="submit"
                            className={`register-submit-btn${focus.submit ? ' register-submit-btn-focus' : ''}`}
                            onFocus={() =>
                                setFocus((f) => ({ ...f, submit: true }))
                            }
                            onBlur={() =>
                                setFocus((f) => ({ ...f, submit: false }))
                            }
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <Link to="/login" className="register-link">
                    Already have an account? Login Here.
                </Link>
            </div>
        </div>
    )
}

export default Register
