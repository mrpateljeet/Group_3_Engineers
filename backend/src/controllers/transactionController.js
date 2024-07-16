const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const isValidObjectId = require('../utils/isValidObjectId');

// Fetch transactions for a user
const getTransactions = async (req, res) => {
    const { userId } = req.query;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('categoryId', 'name');
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

// Add a new transaction
const addTransaction = async (req, res) => {
    const { userId, categoryId, amount, date, description } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(categoryId)) {
        return res.status(400).json({ error: 'Invalid user ID or category ID' });
    }

    try {
        const transaction = new Transaction({
            userId: new mongoose.Types.ObjectId(userId),
            categoryId: new mongoose.Types.ObjectId(categoryId),
            amount,
            date,
            description,
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction.' });
    }
};

// Edit an existing transaction
const editTransaction = async (req, res) => {
    const { id } = req.params;
    const { userId, categoryId, amount, date, description } = req.body;

    if (!isValidObjectId(id) || !isValidObjectId(userId) || !isValidObjectId(categoryId)) {
        return res.status(400).json({ error: 'Invalid ID(s)' });
    }

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.userId = new mongoose.Types.ObjectId(userId);
        transaction.categoryId = new mongoose.Types.ObjectId(categoryId);
        transaction.amount = amount;
        transaction.date = date;
        transaction.description = description;

        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error editing transaction:', error);
        res.status(500).json({ error: 'Error editing transaction' });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error('Error deleting transaction:', error); // Log the full error
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
};
