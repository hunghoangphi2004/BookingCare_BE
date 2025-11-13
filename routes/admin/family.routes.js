const express = require('express');
const router = express.Router();

const role = require('../../middlewares/client/role.middleware');
const familyController = require('../../controllers/admin/family.controller');

router.get('/get-all',  familyController.getAllFamily);
router.get('/get-family-by-id/:id', familyController.getFamilyById);
module.exports = router;
