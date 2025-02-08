const app = require('./app'); // Import Express app
const { sequelize } = require('./models'); // Import Sequelize instance

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (optional: use { force: true } to reset database)
        await sequelize.sync();

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
})();
