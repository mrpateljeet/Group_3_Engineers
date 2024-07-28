import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TransactionForm from './TransactionForm';

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

    const handleSubmit = async (transaction) => {
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
                body: JSON.stringify({ ...transaction, userId: 1 }), // Adjust userId as necessary
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const handleProfile = () => {
        navigate('/profile');
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
        <div>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton color="inherit" onClick={handleBackToDashboard}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Add Transaction
                    </Typography>
                    <IconButton color="inherit" onClick={handleProfile}>
                        <AccountCircle />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <TransactionForm
                onSubmit={handleSubmit}
                initialData={initialData}
                categories={categories}
            />
        </div>
    );
};

export default AddTransaction;
