import React from 'react';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    return (
        <div>
            <h2>Transactions</h2>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.date} - {transaction.amount} - {transaction.description}
                        <button onClick={() => onEdit(transaction)}>Edit</button>
                        <button onClick={() => onDelete(transaction.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
