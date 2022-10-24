const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// /user => GET
router.get('/', userController.getUser);

// /sign-in => GET
router.get('/signin', userController.getSignIn);

// /sign-in => GET
router.get('/orders', userController.getOrders);

module.exports = router;
