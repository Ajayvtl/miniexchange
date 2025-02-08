const { Role, Permission, sequelize } = require('../models');

// Get Permissions for a role (already correctly implemented as getPermissionsForRole)
exports.getPermissionsForRole = async (role) => {
    try {
        const roleWithPermissions = await Role.findOne({
            where: { name: role },
            include: {
                model: Permission,
                attributes: ['name'],
                through: { attributes: [] }, // Exclude intermediate table data
            },
        });

        if (!roleWithPermissions) {
            console.error(`Role '${role}' not found`);
            return [];
        }

        if (!roleWithPermissions.Permissions || roleWithPermissions.Permissions.length === 0) {
            console.warn(`No permissions associated with role '${role}'`);
            return [];
        }

        return roleWithPermissions.Permissions.map((p) => p.name);
    } catch (error) {
        console.error('Error fetching permissions for role:', error);
        throw new Error('Failed to fetch permissions for the role');
    }
};

// Create or Update a Permission
exports.createPermission = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Permission name is required' });
        }

        const [permission, created] = await Permission.findOrCreate({
            where: { name },
            defaults: { description },
        });

        if (!created) {
            return res.status(400).json({ message: 'Permission already exists' });
        }

        res.status(201).json({ message: 'Permission created successfully', permission });
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update Role Permissions
exports.updateRolePermissions = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        if (!roleId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
            return res.status(400).json({ message: 'Role ID and permission IDs are required' });
        }

        // Use a transaction to ensure atomic updates
        await sequelize.transaction(async (t) => {
            // Delete existing permissions for the role
            await sequelize.query(
                'DELETE FROM role_permissions WHERE role_id = :roleId',
                { replacements: { roleId }, transaction: t }
            );

            // Insert new permissions
            const values = permissionIds.map((permissionId) => `(${roleId}, ${permissionId}, NOW(), NOW())`).join(',');
            await sequelize.query(
                `INSERT INTO role_permissions (role_id, permission_id, createdAt, updatedAt) VALUES ${values}`,
                { transaction: t }
            );
        });

        res.status(200).json({ message: 'Role permissions updated successfully' });
    } catch (error) {
        console.error('Error updating role permissions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch all permissions (for admin listing purposes)
exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll();
        res.status(200).json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
