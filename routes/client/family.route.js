const express = require('express');
const router = express.Router();

const role = require('../../middlewares/client/role.middleware');
const familyController = require('../../controllers/client/family.controller');

router.post('/create', familyController.createFamily);
router.get('/get-family',  familyController.getFamilyByUserId);
router.patch('/edit', familyController.updateFamily);
router.post('/request',  familyController.requestFamilyDoctor);

module.exports = router;
