import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions?userId=1'); // Adjust userId as necessary
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

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Fetched Categories: ", data); // Add this line
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const addTransaction = async (transaction) => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...transaction, userId: 1 }), // Adjust userId as necessary
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newTransaction = await response.json();
            setTransactions([...transactions, newTransaction]);
            setShowForm(false);
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const editTransaction = async (transaction) => {
        try {
            const response = await fetch(`http://localhost:3000/api/transactions/${transaction.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTransaction = await response.json();
            setTransactions(transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)));
            setEditingTransaction(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error editing transaction:', error);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
                method: 'DELETE',
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
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingTransaction(null);
        setShowForm(true);
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleAdd}>Add Transaction</button>
            <button onClick={handleProfile}>Profile</button>
            {showForm && (
                <TransactionForm
                    onSubmit={editingTransaction ? editTransaction : addTransaction}
                    initialData={editingTransaction || {}}
                    categories={categories}
                />
            )}
            <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={deleteTransaction} />
        </div>
    );
};

export default Dashboard;
