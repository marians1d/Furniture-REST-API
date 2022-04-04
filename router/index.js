const router = require('express').Router();
const users = require('./users');
const orders = require('./orders');
const comments = require('./comments');
const likes = require('./likes');
const test = require('./test');
const { authController } = require('../controllers');

router.comment('/register', authController.register);
router.comment('/login', authController.login);
router.comment('/logout', authController.logout);

router.use('/users', users);
router.use('/orders', orders);
router.use('/comments', comments);
router.use('/likes', likes);
router.use('/test', test);

module.exports = router;
