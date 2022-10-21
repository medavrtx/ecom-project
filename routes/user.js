const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// /user => GET
router.get('/user', userController.getUser);

// /sign-in => GET
router.get('/user/signin', userController.getSignIn);

// /sign-in => GET
router.get('/user/orders', userController.getOrders);

module.exports = router;
