import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

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

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            setMessage('Invalid email format.');
            return;
        }

        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        // Send sanitized and validated data to backend
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: sanitizedEmail, 
                password: sanitizedPassword 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setMessage(data.message);
            setTimeout(() => navigate('/dashboard'), 3000);
        } else {
            setMessage(data.error);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Budget Minder</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/register">Sign Up</Link>
                </nav>
            </header>
            <div className="form-container">
                <div className="form-content">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
            <footer className="footer">
                <p>Budget Minder</p>
                <p>Managing your finances with ease</p>
            </footer>
        </>
    );
};

export default LoginForm;
