require('dotenv').config(); // Load .env variables
const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Database name
    process.env.DB_USER,     // MySQL username
    process.env.DB_PASSWORD, // MySQL password
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
