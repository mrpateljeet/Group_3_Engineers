import React from 'react';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    return (
        <div>
            <h2>All Expenses</h2>
            <table>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.amount}</td>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.categoryId.name}</td>
                            <td>
                                <button onClick={() => onEdit(transaction)}>Edit</button>
                                <button onClick={() => onDelete(transaction._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;
