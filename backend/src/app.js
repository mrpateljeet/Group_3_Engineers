const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);

// Routes
app.use('/api', userRoutes);

// Test database connection
sequelize.authenticate().then(() => {
    console.log('Database connected...');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
