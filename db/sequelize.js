const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fotaza', 'postgres', 'posgre', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;