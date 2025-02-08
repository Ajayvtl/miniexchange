const express = require('express');
const { createRole, getRolesWithPermissions } = require('../controllers/roleController');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, checkPermission('manage_roles'), getRolesWithPermissions);
router.post('/', verifyToken, checkPermission('manage_roles'), createRole);

module.exports = router;
