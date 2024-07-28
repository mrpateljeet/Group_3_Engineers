import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddTransaction.css';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddTransaction = () => {
    const [initialData, setInitialData] = useState({});
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.transaction) {
            setInitialData(location.state.transaction);
        }
        fetchCategories();
    }, [location.state]);

    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const method = initialData.id ? 'PUT' : 'POST';
            const url = initialData.id
                ? `http://localhost:3000/api/transactions/${initialData.id}`
                : 'http://localhost:3000/api/transactions';
            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...initialData, userId: 1 }), // Adjust userId as necessary
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="transaction-container">
            <header className="transaction-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    &larr;
                </button>
                <h1>Add Transaction</h1>
                <IconButton color="secondary" onClick={handleLogout} style={{ position: 'absolute', right: 16 }}>
                    <ExitToAppIcon />
                </IconButton>
            </header>
            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group2">
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={initialData.amount || ''}
                        onChange={(e) => setInitialData({ ...initialData, amount: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={initialData.date || ''}
                        onChange={(e) => setInitialData({ ...initialData, date: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={initialData.description || ''}
                        onChange={(e) => setInitialData({ ...initialData, description: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Category:</label>
                    <select
                        value={initialData.category || ''}
                        onChange={(e) => setInitialData({ ...initialData, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="add-transaction-button">Submit</button>
            </form>
        </div>
    );
};

export default AddTransaction;
