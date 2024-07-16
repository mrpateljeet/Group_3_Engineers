import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from './TransactionList';
import './Dashboard.css';
import { Button, Card, CardContent, Typography, Grid, AppBar, Toolbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ForecastIcon from '@mui/icons-material/WbSunny';
import GoalIcon from '@mui/icons-material/EmojiEvents';
import backgroundVideo from '../images/gif_background.mp4'; // Ensure the video file is in the correct path

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        const userId = '60d0fe4f5311236168a109ca'; // Ensure this user ID is correct and exists in the database
        try {
            const response = await fetch(`http://localhost:3000/api/transactions?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        }
    };

    const deleteTransaction = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTransactions(transactions.filter((t) => t._id !== id));
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const handleEdit = (transaction) => {
        navigate('/add-transaction', { state: { transaction } });
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleAdd = () => {
        navigate('/add-transaction');
    };

    const handleForecast = () => {
        navigate('/forecast');
    };

    const handleAddGoal = () => {
        navigate('/add-goal');
    };

    return (
        <div className="dashboard-container">
            <video autoPlay loop muted className="background-video">
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="dashboard-content">
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Dashboard
                        </Typography>
                        <IconButton color="inherit" onClick={handleProfile}>
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={3} style={{ padding: 20 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card">
                            <CardContent>
                                <Typography variant="h5">Add Expense</Typography>
                                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
                                    Add
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card">
                            <CardContent>
                                <Typography variant="h5">Profile</Typography>
                                <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={handleProfile}>
                                    Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card">
                            <CardContent>
                                <Typography variant="h5">Add Goal</Typography>
                                <Button variant="contained" color="primary" startIcon={<GoalIcon />} onClick={handleAddGoal}>
                                    Add Goal
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card">
                            <CardContent>
                                <Typography variant="h5">Forecast</Typography>
                                <Button variant="contained" color="primary" startIcon={<ForecastIcon />} onClick={handleForecast}>
                                    Forecast
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={deleteTransaction} />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Dashboard;
