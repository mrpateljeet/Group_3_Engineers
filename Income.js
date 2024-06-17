// models/Income.js
const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly'],
    required: true,
  },
});

const Income = mongoose.model('Income', IncomeSchema);
module.exports = Income;
