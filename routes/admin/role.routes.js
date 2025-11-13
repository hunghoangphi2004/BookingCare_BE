const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/admin/role.controller');

router.get('/get-all', roleController.getAllRole);

router.post("/create", roleController.createRole);

router.patch("/edit/:id", roleController.editRole);

router.delete("/delete/:id", roleController.deleteRole);

router.get('/:id/permissions', roleController.getPermissions);

router.patch('/:id/permissions', roleController.updatePermissions);

router.get('/get-role-by-id/:id', roleController.getRoleById);

module.exports = router;
