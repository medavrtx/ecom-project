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

// /cart
router.route('/cart').get(shopController.getCart).post(shopController.postCart);

// /cart-delete-item => POST
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// /cart-update-item => POST
router.post('/cart-update-item', shopController.postCartUpdateProduct);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

// /checkout/success => GET
router.get('/checkout/success', shopController.getCheckoutSuccess);

// /checkout/cancel => GET
router.get('/checkout/cancel', shopController.getCheckoutCancel);

module.exports = router;
