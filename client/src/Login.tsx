import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focus, setFocus] = useState<{ [k: string]: boolean }>({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.');
            return;
        }
        // TODO: POST /api/auth/login and store token/user in auth context later
        console.log({ username, password });
        navigate('/cookbook');
    };

    return (
        <div className="login-page">
            <div className="login-panel">
                <div className="login-title">ChefGPT</div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-col">
                        <div className="login-form-row">
                            <label htmlFor="login-username" className="login-label">Username:</label>
                            <input
                                id="login-username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                autoComplete="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className={`login-input${focus.username ? ' login-input-focus' : ''}`}
                                onFocus={() => setFocus(f => ({ ...f, username: true }))}
                                onBlur={() => setFocus(f => ({ ...f, username: false }))}
                                required
                            />
                        </div>
                        <div className="login-form-row">
                            <label htmlFor="login-password" className="login-label">Password:</label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={`login-input${focus.password ? ' login-input-focus' : ''}`}
                                onFocus={() => setFocus(f => ({ ...f, password: true }))}
                                onBlur={() => setFocus(f => ({ ...f, password: false }))}
                                required
                            />
                        </div>
                        {error && <div className="login-error">{error}</div>}
                    </div>
                    <div className="login-btn-col">
                        <button
                            type="submit"
                            className={`login-btn${focus.login ? ' login-btn-focus' : ''}`}
                            onFocus={() => setFocus(f => ({ ...f, login: true }))}
                            onBlur={() => setFocus(f => ({ ...f, login: false }))}
                        >
                            login
                        </button>
                    </div>
                </form>
                <div className="login-bottom">
                    Don’t have an account?
                    <Link to="/register" className="login-link">Sign Up Here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
