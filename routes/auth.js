const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// /sign-in => GET
router.get('/login', authController.getLogIn);

// /register=> GET
router.get('/registration', authController.getRegistration);

// /sign-in => POST
router.post('/login', authController.postLogIn);

// /register=> POST
router.post('/registration', authController.postRegistration);

// /logout => POST
router.post('/logoutuser', authController.postLogOut);

// /user => GET
router.get('/user/:userId', authController.getUser);

// /sign-in => GET
router.get('/user/:userId/orders', authController.getOrders);

module.exports = router;
