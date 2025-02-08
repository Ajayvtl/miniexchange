const { sequelize } = require('./models');

(async () => {
    try {
        await sequelize.sync({ alter: true }); // Sync with the database
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();