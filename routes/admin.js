const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');
const { validateProduct, validateCategory } = require('../middleware/validate');

// Middleware to protect admin routes
router.use(isAdmin);

// /admin
router.get('/', adminController.getAdmin);

// /admin/products
router.get('/products', adminController.getProducts);

// /admin/add-product
router
  .route('/products/add')
  .get(adminController.getAddProduct)
  .post(validateProduct, adminController.postAddProduct);

// /admin/products/:productId
router
  .route('/products/:productId')
  .get(adminController.getEditProduct)
  .post(validateProduct, adminController.postEditProduct)
  .delete(adminController.deleteProduct);

// /admin/categories
router
  .route('/categories')
  .get(adminController.getCategories)
  .post(validateCategory, adminController.postAddCategory);

// /admin/categories/:categoryId
router
  .route('/categories/:categoryId')
  .get(adminController.getEditCategory)
  .post(adminController.postEditCategory)
  .delete(adminController.deleteCategory);

// /admin/categories/:categoryId/add-product => POST
router.post(
  '/categories/:categoryId/add-product',
  adminController.postProductToCategory
);

// /admin/categories/:categoryId/:productId/delete => DELETE
router.delete(
  '/categories/:categoryId/:productId/delete',
  adminController.deleteProductFromCategory
);

// /admin/best-sellers
router
  .route('/best-sellers')
  .get(adminController.getBestSellers)
  .post(adminController.postBestSeller);

// /admin/best-sellers => DELETE
router
  .route('/best-sellers/:productId')
  .put(adminController.updateBestSeller)
  .delete(adminController.deleteBestSeller);

// /admin/orders
router.route('/orders').get(adminController.getOrders);

// /user/orders/invoice => GET
router.route('/orders/:orderId').get(adminController.getInvoice);

module.exports = router;
