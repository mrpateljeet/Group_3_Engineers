import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

// Utility functions for validation and sanitization
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const sanitizeInput = (input) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
};

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            setMessage('Invalid email format.');
            return;
        }

        // Sanitize inputs
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        setLoading(true);

        // Send sanitized and validated data to backend
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: sanitizedUsername, 
                email: sanitizedEmail, 
                password: sanitizedPassword 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Save the token for session management
            setMessage(data.message);
           navigate('/complete-profile');
        } else {
            setMessage(data.error);
            setLoading(false);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Budget Minder</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                </nav>
            </header>
            <div className={`form-container ${loading ? 'loading' : ''}`}>
                <div className="form-content">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="register-button" disabled={loading}>Register</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
                {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
            </div>
            <footer className="footer">
                <p>Budget Minder</p>
                <p>Managing your finances with ease</p>
            </footer>
        </>
    );
};

export default RegisterForm;
