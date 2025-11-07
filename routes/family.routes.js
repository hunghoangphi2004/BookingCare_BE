const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware'); 
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')
const familyController = require('../controllers/family.controller');

router.get('/get-all', auth,role("admin"), familyController.getAllFamily);
router.get('/get-family-by-id/:id', auth,role("admin","doctor"), familyController.getFamilyById);
router.post('/create',auth, role("patient"), familyController.createFamily);
router.get('/get-family', auth,role("patient"), familyController.getFamilyByUserId);
router.put('/edit', auth, role("patient"), familyController.updateFamily);
router.post('/request', auth, role("patient"), familyController.requestFamilyDoctor);

module.exports = router;
