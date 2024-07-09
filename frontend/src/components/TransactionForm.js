import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit, initialData, categories }) => {
    const [amount, setAmount] = useState(initialData.amount || '');
    const [date, setDate] = useState(initialData.date || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [categoryId, setCategoryId] = useState(initialData.categoryId || '');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ amount, date, description, categoryId });
    };

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount || '');
            setDate(initialData.date || '');
            setDescription(initialData.description || '');
            setCategoryId(initialData.categoryId || '');
        }
    }, [initialData]);

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Category:</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TransactionForm;
