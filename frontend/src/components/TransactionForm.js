import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TransactionForm = () => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const transaction = location.state ? location.state.transaction : null;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/categories');
                const data = await response.json();
                console.log('Fetched categories:', data); // Log the fetched data

                if (Array.isArray(data) && data.length > 0) {
                    setCategories(data);
                } else {
                    setError('No categories found.');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories.');
            }
        };

        fetchCategories();

        if (transaction) {
            setAmount(transaction.amount);
            setDate(new Date(transaction.date).toISOString().split('T')[0]); // Convert date to yyyy-mm-dd format
            setDescription(transaction.description);
            setCategory(transaction.categoryId);
        }
    }, [transaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const transactionData = {
            amount,
            date,
            description,
            categoryId: category,
            userId: '60d0fe4f5311236168a109ca', // Ensure this user ID is valid
        };

        const url = transaction
            ? `http://localhost:3000/api/transactions/${transaction._id}`
            : 'http://localhost:3000/api/transactions';
        const method = transaction ? 'PUT' : 'POST';

        console.log('Submitting transaction:', transactionData); // Log the transaction data

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Server response:', result); // Log the server response
            setMessage(transaction ? 'Transaction updated successfully!' : 'Transaction added successfully!');
            setAmount('');
            setDate('');
            setDescription('');
            setCategory('');

            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError('Failed to add transaction.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Amount:</label>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No categories found.</option>
                    )}
                </select>
            </div>
            <button type="submit">Submit</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default TransactionForm;
