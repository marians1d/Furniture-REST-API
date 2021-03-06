const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const formidable = require('express-formidable');
const { auth } = require('../utils');

router.get('/profile', auth(), authController.getProfileInfo);
// TODO: add provider status request
router.put('/profile', auth(), formidable(), authController.editProfileInfo);
router.put('/profile/status', auth(), authController.editProfileStatus);

module.exports = router;