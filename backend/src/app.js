// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const forecastRoutes = require('./routes/forecastRoutes');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', transactionRoutes);
app.use('/api', categoryRoutes);
app.use('/api', goalRoutes);
app.use('/api', forecastRoutes);
app.use('/api/users', authRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
