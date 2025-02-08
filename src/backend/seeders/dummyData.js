require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Role, Permission } = require('../models');

const seedData = async () => {
    try {
        console.log('Seeding data...');
        await sequelize.sync({ force: true }); // Force sync database schema

        // Create roles
        const adminRole = await Role.create({ name: 'Admin', description: 'Administrator role' });
        const superAdminRole = await Role.create({ name: 'Super Admin', description: 'Super Administrator role' });

        // Create permissions
        const manageUsers = await Permission.create({ name: 'Manage Users', description: 'Can manage users' });
        const viewReports = await Permission.create({ name: 'View Reports', description: 'Can view reports' });

        // Associate permissions with roles
        await adminRole.addPermissions([manageUsers, viewReports]);
        await superAdminRole.addPermissions([manageUsers, viewReports]);

        // Create dummy user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role_id: adminRole.id,
            is_enabled: true,
        });

        console.log('Dummy data seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
