const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    const { userId } = req.query;
    try {
        const transactions = await Transaction.findAll({ where: { userId } });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

const addTransaction = async (req, res) => {
    const { userId, categoryId, amount, date, description } = req.body;

    try {
        const transaction = await Transaction.create({
            userId,
            categoryId,
            amount,
            date,
            description
        });
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction.' });
    }
};

const editTransaction = async (req, res) => {
    const { id } = req.params;
    const { userId, categoryId, amount, date, description } = req.body;
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        transaction.userId = userId;
        transaction.categoryId = categoryId;
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

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
};
