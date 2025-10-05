import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginForm.css';
import { AuthUser } from '../../types/User';

interface LoginFormProps {
    onLogin?: (user: AuthUser) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });
            const data = response.data;

            if (data.success && data.role) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userName', username);
                }
                if (onLogin) onLogin({
                    name: username,
                    role: data.role
                });
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login gagal');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghubungi server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [username, password, onLogin, navigate]);

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="bank-logo">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 21h18" />
                            <path d="M5 21V7l8-4v18" />
                            <path d="M19 21V11l-6-4" />
                            <path d="M9 9v.01" />
                            <path d="M9 12v.01" />
                            <path d="M9 15v.01" />
                            <path d="M9 18v.01" />
                        </svg>
                    </div>
                    <h1 className="login-title">Bank Dika</h1>
                    <p className="login-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username" className="input-label">
                            Email atau Username
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Masukkan email atau username"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">
                            Password
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <circle cx="12" cy="16" r="1" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Masukkan password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-wrapper">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Ingat saya
                        </label>
                        <a href="#" className="forgot-password">Lupa password?</a>
                    </div>
                    {error && (
                        <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>
                    )}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            'Masuk'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Belum punya akun?{" "}
                        <a
                            href="#"
                            className="register-link"
                            onClick={e => {
                                e.preventDefault();
                                navigate("/register");
                            }}
                        >
                            Daftar di sini
                        </a>
                    </p>
                </div>
            </div>

            <div className="login-background">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>
        </div>
    );
};

export default LoginForm;