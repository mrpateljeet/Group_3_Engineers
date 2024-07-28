import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from './TransactionList';
import './Dashboard.css';
import { Button, Card, CardContent, Typography, Grid, AppBar, Toolbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ForecastIcon from '@mui/icons-material/WbSunny';
import GoalIcon from '@mui/icons-material/EmojiEvents';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BalanceIcon from '@mui/icons-material/AccountBalance';
import ExpenseIcon from '@mui/icons-material/ArrowDownward';
import ProfitIcon from '@mui/icons-material/ArrowUpward';
import backgroundVideo from '../images/gif_background.mp4';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
        fetchBalance();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [transactions]);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
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

    const fetchBalance = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance(0);
        }
    };

    const calculateTotals = () => {
        let expense = 0;
        let profit = 0;
        transactions.forEach(transaction => {
            if (transaction.categoryId.name.toLowerCase() === 'income') {
                profit += parseFloat(transaction.amount);
            } else if (transaction.categoryId.name.toLowerCase() === 'expense') {
                expense += parseFloat(transaction.amount);
            }
        });
        setTotalExpense(expense);
        setTotalProfit(profit);
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
                fetchBalance(); // Update balance after deletion
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    return (
        <div className="dashboard-container">
            <video autoPlay loop muted className="background-video">
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <AppBar position="static" color="primary" className="app-bar">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleProfile}>
                        <AccountCircle />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className="dashboard-content">
                <div className="balance-card">
                    <div className="balance-item current-balance">
                        <Typography variant="h6">Current Balance</Typography>
                        <Typography variant="h5" className="balance-amount">
                            <BalanceIcon /> <span>${balance.toFixed(2)}</span>
                        </Typography>
                    </div>
                    <div className="balance-item expense">
                        <Typography variant="h6">Total Expense</Typography>
                        <Typography variant="h5" className="balance-amount">
                            <ExpenseIcon /> <span>${totalExpense.toFixed(2)}</span>
                        </Typography>
                    </div>
                    <div className="balance-item profit">
                        <Typography variant="h6">Total Profit</Typography>
                        <Typography variant="h5" className="balance-amount">
                            <ProfitIcon /> <span>${totalProfit.toFixed(2)}</span>
                        </Typography>
                    </div>
                </div>
                <Grid container spacing={3} className="dashboard-cards">
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Add Expense</Typography>
                                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
                                    Add
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Profile</Typography>
                                <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={handleProfile}>
                                    Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Savings Goal</Typography>
                                <Button variant="contained" color="primary" startIcon={<GoalIcon />} onClick={handleAddGoal}>
                                    Add Goal
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Budget Forecast</Typography>
                                <Button variant="contained" color="primary" startIcon={<ForecastIcon />} onClick={handleForecast}>
                                    Forecast
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        {transactions.length > 0 ? (
                            <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={deleteTransaction} />
                        ) : (
                            <Typography variant="h6" align="center" className="no-transactions">
                                No transactions found.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Dashboard;
