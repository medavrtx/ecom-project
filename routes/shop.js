const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

// / => GET
router.get('/', shopController.getHome);

// / => GET
router.get('/shop/:productId', shopController.getProduct);

// /info => GET
router.get('/info', shopController.getInfo);

// /cart => GET
router.get('/cart', shopController.getCart);

// /cart => POST
router.post('/cart', shopController.postCart);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;
