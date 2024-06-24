const sequelize = require('./config/database');
const User = require('./models/User');

const syncDb = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced!');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
};

syncDb();
