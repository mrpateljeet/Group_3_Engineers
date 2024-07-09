const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sequelize = require('./config/database');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', transactionRoutes);
app.use('/api', categoryRoutes);


// Define relationships if necessary
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Transaction, { foreignKey: 'categoryId' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

// Sync models with database and insert categories if they don't exist
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synchronized...');

    // Insert categories if they don't exist
    const categories = [
        { name: 'income', type: 'income' },
        { name: 'expense', type: 'expense' }
    ];

    for (const category of categories) {
        await Category.findOrCreate({
            where: { name: category.name },
            defaults: category
        });
    }

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Unable to synchronize the database:', err);
});
