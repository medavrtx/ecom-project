const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

// => GET
router.get('/', shopController.getHome);

// => GET
router.get('/shop-all', shopController.getProducts);

// => GET
router.get('/shop-all/:productId', shopController.getProduct);

// => GET
router.get('/shop/:categoryTitle', shopController.getCategory);

// /cart => GET
router.get('/cart', shopController.getCart);

// /cart => POST
router.post('/cart', shopController.postCart);

// /cart => POST
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// /cart => POST
router.post('/cart-update-item', shopController.postCartUpdateProduct);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

// /checkout => GET
router.get('/checkout/success', shopController.getCheckoutSuccess);

// /checkout => GET
router.get('/checkout/cancel', shopController.getCheckoutCancel);

module.exports = router;
