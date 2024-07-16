const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, editTransaction, deleteTransaction } = require('../controllers/transactionController');

router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.put('/transactions/:id', editTransaction);
router.delete('/transactions/:id', deleteTransaction);

module.exports = router;
