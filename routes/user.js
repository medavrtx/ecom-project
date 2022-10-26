const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// /user => GET
router.get('/', userController.getUser);

// /order => POST
router.post('/create-order', userController.postOrder);

// /sign-in => GET
router.get('/orders', userController.getOrders);

module.exports = router;
