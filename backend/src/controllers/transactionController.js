const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Category = require('../models/Category');
const isValidObjectId = require('../utils/isValidObjectId');
const roundToTwoDecimals = require('../utils/roundToTwoDecimals');

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

        const user = await User.findById(userId);
        const category = await Category.findById(categoryId);

        if (!user || !category) {
            return res.status(404).json({ error: 'User or Category not found' });
        }

        // Update the user's balance based on transaction category
        if (category.name.toLowerCase() === 'income') {
            user.accountBalance += parseFloat(amount);
        } else if (category.name.toLowerCase() === 'expense') {
            user.accountBalance -= parseFloat(amount);
        }

        user.accountBalance = roundToTwoDecimals(user.accountBalance);
        await user.save();

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction.' });
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

        const user = await User.findById(transaction.userId);
        const category = await Category.findById(transaction.categoryId);

        if (!user || !category) {
            return res.status(404).json({ error: 'User or Category not found' });
        }

        // Revert the user's balance based on transaction category
        if (category.name.toLowerCase() === 'income') {
            user.accountBalance -= parseFloat(transaction.amount);
        } else if (category.name.toLowerCase() === 'expense') {
            user.accountBalance += parseFloat(transaction.amount);
        }

        user.accountBalance = roundToTwoDecimals(user.accountBalance);
        await transaction.deleteOne();
        await user.save();

        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};

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

        const user = await User.findById(userId);
        const oldCategory = await Category.findById(transaction.categoryId);
        const newCategory = await Category.findById(categoryId);

        if (!user || !oldCategory || !newCategory) {
            return res.status(404).json({ error: 'User or Category not found' });
        }

        // Revert old transaction's effect on balance
        if (oldCategory.name.toLowerCase() === 'income') {
            user.accountBalance -= parseFloat(transaction.amount);
        } else if (oldCategory.name.toLowerCase() === 'expense') {
            user.accountBalance += parseFloat(transaction.amount);
        }

        // Update transaction
        transaction.userId = new mongoose.Types.ObjectId(userId);
        transaction.categoryId = new mongoose.Types.ObjectId(categoryId);
        transaction.amount = amount;
        transaction.date = date;
        transaction.description = description;

        await transaction.save();

        // Apply new transaction's effect on balance
        if (newCategory.name.toLowerCase() === 'income') {
            user.accountBalance += parseFloat(amount);
        } else if (newCategory.name.toLowerCase() === 'expense') {
            user.accountBalance -= parseFloat(amount);
        }

        user.accountBalance = roundToTwoDecimals(user.accountBalance);
        await user.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error editing transaction:', error);
        res.status(500).json({ error: 'Error editing transaction' });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
};
