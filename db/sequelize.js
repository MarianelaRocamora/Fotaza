const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech')
                ? { require: true, rejectUnauthorized: false }
                : false
        }
    }
);

module.exports = sequelize;