import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!validatePassword(password)) {
    //   setMessage('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.');
    //   return;
    // }

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
      localStorage.setItem('token', data.token); // Store the token in local storage
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
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
