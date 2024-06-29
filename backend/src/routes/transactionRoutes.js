const express = require('express');
const router = express.Router();
const { addTransaction, editTransaction, deleteTransaction, getTransactions } = require('../controllers/transactionController');

router.post('/transactions', addTransaction);
router.put('/transactions/:id', editTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/transactions', getTransactions);

module.exports = router;
