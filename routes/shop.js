const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

// / => GET
router.get('/', shopController.getHome);

// /info => GET
router.get('/info', shopController.getInfo);

// /cart => GET
router.get('/cart', shopController.getCart);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

// /user => GET
router.get('/user', shopController.getUser);

// /sign-in => GET
router.get('/signin', shopController.getSignIn);

module.exports = router;
