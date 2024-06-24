const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sql5715513', 'sql5715513', 'IrHV9pNJ6E', {
    host: 'sql5.freesqldatabase.com',
    dialect: 'mysql',
});

module.exports = sequelize;
