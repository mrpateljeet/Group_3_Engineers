const Transaction = require('../models/Transaction');

// Add a new transaction
const addTransaction = async (req, res) => {
    const { userId, categoryId, amount, date, description } = req.body;

    try {
        const transaction = await Transaction.create({ userId, categoryId, amount, date, description });
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Edit a transaction
const editTransaction = async (req, res) => {
    const { id } = req.params;
    const { categoryId, amount, date, description } = req.body;

    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }

        transaction.categoryId = categoryId;
        transaction.amount = amount;
        transaction.date = date;
        transaction.description = description;
        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error editing transaction:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }

        await transaction.destroy();
        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
    const { userId } = req.query;

    try {
        const transactions = await Transaction.findAll({ where: { userId } });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    addTransaction,
    editTransaction,
    deleteTransaction,
    getTransactions,
};
