const express = require('express');
const { getPermissions, createPermission, updateRolePermissions } = require('../controllers/permissionController');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, checkPermission('manage_permissions'), getPermissions);
router.post('/', verifyToken, checkPermission('manage_permissions'), createPermission);
router.put('/update', verifyToken, checkPermission('manage_roles'), updateRolePermissions);
module.exports = router;
