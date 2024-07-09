import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from './TransactionList';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/transactions?userId=1', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); // Adjust userId as necessary
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
            setTransactions(transactions.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        navigate('/add-transaction', { state: { transaction } });
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleAdd = () => {
        setEditingTransaction(null);
        navigate('/add-transaction');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleAdd}>Add Transaction</button>
            <button onClick={handleProfile}>Profile</button>
            <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={deleteTransaction} />
        </div>
    );
};

export default Dashboard;
