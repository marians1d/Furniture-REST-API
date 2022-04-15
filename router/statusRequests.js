const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { statusRequestController } = require('../controllers');

// middleware that is specific to this router

router.get('/', auth(), statusRequestController.getRequests);
router.get('/:requestId', auth(), statusRequestController.getRequest);
router.post('/', auth(), statusRequestController.createRequest);

module.exports = router;