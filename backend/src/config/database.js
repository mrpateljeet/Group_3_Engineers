const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('freedb_sql5715513', 'freedb_sql5715513', 'Y3uSA4c#Mn2n77z', {
    host: 'sql.freedb.tech',
    dialect: 'mysql',
});

module.exports = sequelize;
