const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

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
  .post(
    [
      body('title').isString().isLength({ min: 1 }).trim(),
      body('price').isFloat(),
      body('description').isLength({ min: 1, max: 400 }).trim()
    ],
    adminController.postAddProduct
  );

// /admin/products/:productId
router
  .route('/products/:productId')
  .get(adminController.getEditProduct)
  .post(
    [
      body('title').isString().isLength({ min: 1 }).trim(),
      body('price').isFloat(),
      body('description').isLength({ min: 1, max: 400 }).trim()
    ],
    adminController.postEditProduct
  )
  .delete(adminController.deleteProduct);

// /admin/categories
router
  .route('/categories')
  .get(adminController.getCategories)
  .post(adminController.postAddCategory);

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

module.exports = router;
