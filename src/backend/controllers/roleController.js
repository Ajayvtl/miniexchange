const { Role, Permission, RolePermission } = require('../models');
const { insertAuditLog } = require('../utils/logger');

// exports.getRoles = async (req, res) => {
//     try {
//         const roles = await Role.findAll();
//         res.status(200).json(roles);
//     } catch (error) {
//         console.error('Error fetching roles:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

exports.createRole = async (req, res) => {
    try {
        const { name, display_name, permissions } = req.body;

        const newRole = await Role.create({ name, display_name });

        // Associate permissions
        for (const permissionId of permissions) {
            await RolePermission.create({ role_id: newRole.id, permission_id: permissionId });
        }

        await insertAuditLog(req.user.id, newRole.id, 'Created new role');
        res.status(201).json({ message: 'Role created successfully', newRole });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getRolesWithPermissions = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: {
                model: Permission,
                attributes: ['id', 'name', 'description'], // Only return specific fields
                through: { attributes: [] }, // Exclude junction table fields
            },
        });
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles and permissions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};