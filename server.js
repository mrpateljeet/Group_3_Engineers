// server.js backend tool
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Income = require('./models/Income');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/budget-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/api/income', async (req, res) => {
  const { amount, frequency } = req.body;

  const income = new Income({ amount, frequency });
  try {
    await income.save();
    res.status(201).send({ message: 'Income added successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Error adding income' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
