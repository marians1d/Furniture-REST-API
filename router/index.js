const router = require('express').Router();
const users = require('./users');
const orders = require('./orders');
const comments = require('./comments');
const test = require('./test');
const { authController } = require('../controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use('/users', users);
router.use('/orders', orders);
router.use('/comments', comments);
router.use('/test', test);

module.exports = router;
