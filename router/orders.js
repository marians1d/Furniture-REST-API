const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { orderController, commentController } = require('../controllers');

// middleware that is specific to this router

router.get('/', orderController.getOrders);
router.post('/', auth(), orderController.createOrder);

router.get('/:orderId', orderController.getOrder);
router.post('/:orderId', auth(), commentController.createComment);
router.put('/:orderId', auth(), orderController.subscribe);
router.put('/:orderId/comments/:commentId', auth(), commentController.editComment);
router.delete('/:orderId/comments/:commentId', auth(), commentController.deleteComment);

// router.get('/my-trips/:id/reservations', auth(), orderController.getReservations);

module.exports = router;